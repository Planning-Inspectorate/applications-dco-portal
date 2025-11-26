# TODOs:
#### We did mention about naming on one or two values but can't remember which ones around service user and nsip user
#### Choose better naming for: module, app_name and file name?
#### Move some items into a newer file similar to appeals?

module "function_integration" {
  #checkov:skip=CKV_TF_1: Use of commit hash are not required for our Terraform modules
  source = "github.com/Planning-Inspectorate/infrastructure-modules.git//modules/node-function-app?ref=1.53"

  resource_group_name = azurerm_resource_group.primary.name
  location            = module.primary_region.location

  # naming
  app_name        = "service-bus-integration"
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
    # reference to bo service bus? find the value here, do we copy the pattern in appeals bo or inspector.
    # Find this resource in azure and work backwards
    ServiceBusConnection__fullyQualifiedNamespace = "${local.service_bus.name}.servicebus.windows.net" # come back to this
    SQL_CONNECTION_STRING                         = local.key_vault_refs["sql-app-connection-string"]
    SERVICE_USER_TOPIC                            = "service-user"
    SERVICE_USER_SUBSCRIPTION                     = azurerm_servicebus_subscription.service_user_subscription.name
    NSIP_PROJECT_TOPIC                            = "nsip-project"
    NSIP_PROJECT_SUBSCRIPTION                     = azurerm_servicebus_subscription.nsip_project_subscription.name
  }
}

# Reference Back Office Service Bus namespace (used by subscriptions and role assignments)
// Back-office Service Bus namespace lookup.
// The tfvars currently provide only `resource_group_name` and `storage_account_name` for back_office_config.
// Allow callers to optionally provide `service_bus_namespace_name`. If not provided, we construct
// a likely namespace name as a best-effort fallback.
locals {
  back_office_servicebus_name = try(var.back_office_config.service_bus_namespace_name, "")
  inferred_servicebus_name    = local.back_office_servicebus_name != "" ? local.back_office_servicebus_name : format("%s-sb-%s", local.service_name, var.environment)
}

data "azurerm_servicebus_namespace" "back_office_sb" {
  name                = local.inferred_servicebus_name
  resource_group_name = var.back_office_config.resource_group_name
}

# These should both be data calls to reference existing topics in back office service bus as these already exist we do not want to recreate them as they are already in back office which we are linking to
data "azurerm_servicebus_topic" "service_user" {
  name         = "service-user" # This probably is not a variable or was it that we don't need to go so far into the dot notation. Was previously var.sb_topic_names.submissions.
  namespace_id = local.service_bus.id
}

data "azurerm_servicebus_topic" "nsip_project" {
  name         = "nsip-project" # I don't believe this is correct
  namespace_id = local.service_bus.id
  # topics are read-only data sources here; TTL is a topic property used only when creating a topic resource
}

#### Needed we want a data block call on the resource not create a new one
data "azurerm_private_dns_zone" "service_bus" {
  name                = "privatelink.servicebus.windows.net"
  resource_group_name = var.tooling_config.network_rg

  provider = azurerm.tooling
}

locals {
  service_bus = {
    id   = data.azurerm_servicebus_namespace.back_office_sb.id
    name = data.azurerm_servicebus_namespace.back_office_sb.name
  }
}

resource "azurerm_servicebus_subscription" "service_user_subscription" {
  name                                 = "service-user-dco-portal-sub"
  topic_id                             = "${local.service_bus.id}/topics/service-user" # this should be a data call
  max_delivery_count                   = 1
  dead_lettering_on_message_expiration = true
  default_message_ttl                  = var.sb_ttl.service_user
}

resource "azurerm_servicebus_subscription" "nsip_project_subscription" {
  name                                 = "nsip-project-dco-portal-sub"
  topic_id                             = "${local.service_bus.id}/topics/nsip-project" # this should also be a data call
  max_delivery_count                   = 1
  dead_lettering_on_message_expiration = true
  default_message_ttl                  = var.sb_ttl.nsip_project
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

resource "azurerm_private_endpoint" "sb_main" {
  count = data.azurerm_servicebus_namespace.back_office_sb.sku == "Premium" ? 1 : 0 # A data call that will get the sku of environment

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

resource "azurerm_storage_account" "functions" {
  #TODO: Customer Managed Keys
  #checkov:skip=CKV2_AZURE_1: Customer Managed Keys not implemented yet
  #checkov:skip=CKV2_AZURE_18: Customer Managed Keys not implemented yet
  #TODO: Logging
  #checkov:skip=CKV_AZURE_33: Logging not implemented yet
  #checkov:skip=CKV2_AZURE_8: Logging not implemented yet
  #TODO: Access restrictions
  #checkov:skip=CKV_AZURE_35: Network access restrictions
  #checkov:skip=CKV_AZURE_43: "Ensure Storage Accounts adhere to the naming rules"
  #checkov:skip=CKV_AZURE_59: TODO: Ensure that Storage accounts disallow public access
  #checkov:skip=CKV_AZURE_206: TODO: Ensure that Storage Accounts use replication
  #checkov:skip=CKV2_AZURE_33: "Ensure storage account is configured with private endpoint"
  #checkov:skip=CKV2_AZURE_38: "Ensure soft-delete is enabled on Azure storage account"
  #checkov:skip=CKV2_AZURE_40: "Ensure storage account is not configured with Shared Key authorization"
  #checkov:skip=CKV2_AZURE_41: "Ensure storage account is configured with SAS expiration policy"

  name                             = "pinsstfuncdco${var.environment}"
  resource_group_name              = azurerm_resource_group.primary.name
  location                         = module.primary_region.location
  account_tier                     = "Standard"
  account_replication_type         = "LRS"
  allow_nested_items_to_be_public  = false
  cross_tenant_replication_enabled = false
  https_traffic_only_enabled       = true

  tags = local.tags
}
