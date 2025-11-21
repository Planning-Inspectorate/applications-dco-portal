module "function_integration" {
  #checkov:skip=CKV_TF_1: Use of commit hash are not required for our Terraform modules
  source = "github.com/Planning-Inspectorate/infrastructure-modules.git//modules/node-function-app?ref=1.53"

  resource_group_name = azurerm_resource_group.primary.name
  location            = module.primary_region.location

  # naming
  app_name        = "service-bus-integration" # choose a better name? Plus also the file name and module name?
  resource_suffix = var.environment
  service_name    = local.service_name
  tags            = local.tags

  # service plan
  app_service_plan_id = azurerm_service_plan.apps.id

  # storage
  function_apps_storage_account            = azurerm_storage_account.functions.name
  function_apps_storage_account_access_key = azurerm_storage_account.functions.primary_access_key

  # networking
  integration_subnet_id      = azurerm_subnet.apps.id # do we need any further changes?
  outbound_vnet_connectivity = true

  # monitoring
  action_group_ids            = local.action_group_ids
  app_insights_instrument_key = azurerm_application_insights.main.instrumentation_key
  log_analytics_workspace_id  = azurerm_log_analytics_workspace.main.id
  monitoring_alerts_enabled   = var.alerts_enabled

  # settings
  function_node_version = var.apps_config.functions_node_version
  app_settings = {
    # back office has a namespace here: pins-sb-back-office-dev-ukw-001. We have a data refernce to it below ⬇️
    CBOS_API_URL = "https://${data.azurerm_linux_web_app.cbos_api.default_hostname}"
    # reference to bo service bus? find the value here, do we copy the pattern in appeals bo or inspector.
    # Find this resource in azure and work backwards
    ServiceBusConnection__fullyQualifiedNamespace = "${local.service_bus.name}.servicebus.windows.net"
    OS_API_KEY                                    = local.key_vault_refs["os-api-key"]
    SQL_CONNECTION_STRING                         = local.key_vault_refs["sql-app-connection-string"] # unsure full usage of this with the app
    SERVICE_USER_TOPIC                            = "service-user"
    SERVICE_USER_SUBSCRIPTION                     = azurerm_servicebus_subscription.service_user_subscription.name
    NSIP_PROJECT_TOPIC                            = "nsip-project"
    NSIP_PROJECT_SUBSCRIPTION                     = azurerm_servicebus_subscription.nsip_project_subscription.name
  }
}

##################################################################
############               MONDAY                     ############
############              =======                     ############
############ - figure out cbos integration            ############
############ - ensure all vars and tfvars are correct ############
############ - understand all components              ############
##################################################################

# Keep here or move into data.tf
# We need data block references to applications service bus resource; We are getting the endpoint here to connect to it from this function app.
data "azurerm_linux_web_app" "cbos_api" {
  name                = var.apps_config.cbos.api_app_name
  resource_group_name = var.apps_config.cbos.api_app_rg
}

# Reference Back Office Service Bus namespace (used by subscriptions and role assignments)
data "azurerm_servicebus_namespace" "back_office_sb" {
  name                = var.apps_config.cbos.service_bus_namespace_name
  resource_group_name = var.back_office_config.resource_group_name
}

locals {
  service_bus = {
    id   = data.azurerm_servicebus_namespace.back_office_sb.id
    name = data.azurerm_servicebus_namespace.back_office_sb.name
  }
}

resource "azurerm_servicebus_subscription" "service_user_subscription" {
  name                                 = "service-user-dco-portal-sub"   # use correct naming with variables and locals etc., no as this is what they wanted on their ticket
  topic_id                             = "${local.service_bus.id}/topics/service-user"
  max_delivery_count                   = 1
  dead_lettering_on_message_expiration = true
  default_message_ttl                  = var.sb_ttl.dco
}

resource "azurerm_servicebus_subscription" "nsip_project_subscription" {
  name                                 = "nsip-project-dco-portal-sub"
  topic_id                             = "${local.service_bus.id}/topics/nsip-project"
  max_delivery_count                   = 1
  dead_lettering_on_message_expiration = true
  default_message_ttl                  = var.sb_ttl.nsip
}

# RBAC for secrets
# Same as inspector programming, links up with app-web.tf that defines it, needed to access key vault secrets
resource "azurerm_role_assignment" "function_integration_secrets_user" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = module.function_integration.principal_id
}

## Add role assignments so the function app can read from the Service Bus via Managed Identity
resource "azurerm_role_assignment" "function_integration_servicebus_data_owner" {
  scope                = local.service_bus.id
  role_definition_name = "Azure Service Bus Data Receiver"
  principal_id         = module.function_integration.principal_id
}

# Move into Networking?
resource "azurerm_private_endpoint" "sb_main" {
  count = var.service_bus_config.sku == "Premium" ? 1 : 0

  name                = "pins-pe-${local.service_name}-sb-${var.environment}"
  resource_group_name = azurerm_resource_group.primary.name
  location            = module.primary_region.location
  subnet_id           = azurerm_subnet.main.id

  private_dns_zone_group {
    name                 = "pins-pdns-${local.service_name}-sb-${var.environment}"
    private_dns_zone_ids = [data.azurerm_private_dns_zone.service_bus.id]
  }

  private_service_connection {
    name                           = "pins-psc-${local.service_name}-sb-${var.environment}"
    private_connection_resource_id = local.service_bus.id
    is_manual_connection           = false
    subresource_names              = ["namespace"]
  }

  tags = local.tags
}

resource "azurerm_servicebus_topic" "service-user" {
  name                = var.sb_topic_names.submissions.service-user
  namespace_id        = local.service_bus.id
  default_message_ttl = var.sb_ttl.default
}

resource "azurerm_servicebus_topic" "nsip-project" {
  name                = var.sb_topic_names.submissions.nsip-project
  namespace_id        = local.service_bus.id
  default_message_ttl = var.sb_ttl.default
}
