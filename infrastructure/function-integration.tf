## 📋 TODOs:
#### ⭕ We did mention about naming on one or two values but can't remember which ones around service user and nsip user
#### ⭕ Choose better naming for: module, app_name and file name?
#### ⭕ Move some items into a newer file similar to appeals?
#### ⭕ Do we need the extra locals in this file or could we remove it and use something else to get the file smaller
#### ⭕ Remove any appeals references
#### ⭕ Make changes to the Build pipeline
#### ⭕ Make changes to the Deploy pipeline

# A subscription will

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
  integration_subnet_id      = azurerm_subnet.apps.id # do we need any further changes? Is this referenced anywhere?
  outbound_vnet_connectivity = true

  # monitoring
  action_group_ids            = local.action_group_ids
  app_insights_instrument_key = azurerm_application_insights.main.instrumentation_key
  log_analytics_workspace_id  = azurerm_log_analytics_workspace.main.id
  monitoring_alerts_enabled   = var.alerts_enabled

  # settings
  function_node_version = var.apps_config.functions_node_version
  app_settings = {
    ServiceBusConnection__fullyQualifiedNamespace = "${var.back_office_config.service_bus_name}.servicebus.windows.net" # removed local.service_bus.name
    SQL_CONNECTION_STRING                         = local.key_vault_refs["sql-app-connection-string"]
    SERVICE_USER_TOPIC                            = "service-user"
    SERVICE_USER_SUBSCRIPTION                     = azurerm_servicebus_subscription.service_user_subscription.name
    NSIP_PROJECT_TOPIC                            = "nsip-project"
    NSIP_PROJECT_SUBSCRIPTION                     = azurerm_servicebus_subscription.nsip_project_subscription.name
  }
}

locals { # could delete this entirely if we are referencing via vars?
  service_bus = {
    id   = data.azurerm_servicebus_namespace.back_office_sb.id
    name = data.azurerm_servicebus_namespace.back_office_sb.name
  }
}

# despite this data call name being hard coded in the tfvars it will still bring back other attiributes such as id and sku...
data "azurerm_servicebus_namespace" "back_office_sb" {
  name                = var.back_office_config.service_bus_name    # locals.service_bus.name - this creates a cycle error as data>local>data
  resource_group_name = var.back_office_config.resource_group_name # this will find it via vars->tfvars
}

data "azurerm_servicebus_topic" "service_user" {
  name         = "service-user"       # Need to grab service user from this # This should be a data call as the resource already exists? Was previously var.sb_topic_names.submissions.
  namespace_id = local.service_bus.id # or / data.azurerm_servicebus_namespace.back_office_sb.id
}

data "azurerm_servicebus_topic" "nsip_project" {
  name         = "nsip-project"                                      # I am pretty sure this is correct and do not need to dive into the resources to grab but simply a string to reference it
  namespace_id = data.azurerm_servicebus_namespace.back_office_sb.id # Just showing the different way but then why use locals at all if using this method
}

## ❓ Needed we want a data block call on the resource not create a new one. Ensure that this is referencing correctly and links up as extended
## 🚨 need to go over this and understand the flow of it, what it is referencing etc
data "azurerm_private_dns_zone" "service_bus" {
  name                = "privatelink.servicebus.windows.net"
  resource_group_name = var.tooling_config.network_rg

  provider = azurerm.tooling
}

resource "azurerm_servicebus_subscription" "service_user_subscription" {
  name                                 = "service-user-dco-portal-sub"
  topic_id                             = "${data.azurerm_servicebus_namespace.back_office_sb.id}/topics/service-user" # or 🚨❓ local.service_bus.id, it is better to directly reference so we know straight away what it is referencing, if the locals does not stop repeating code then just use data this should be a data call; But if I am using locals elsewhere perhaps keep to locals?
  max_delivery_count                   = 1
  dead_lettering_on_message_expiration = true
  default_message_ttl                  = var.sb_ttl.service_user
}

resource "azurerm_servicebus_subscription" "nsip_project_subscription" {
  name                                 = "nsip-project-dco-portal-sub"
  topic_id                             = "${data.azurerm_servicebus_namespace.back_office_sb.id}/topics/nsip-project"
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
  count = data.azurerm_servicebus_namespace.back_office_sb.sku == "Premium" ? 1 : 0

  name                = "pins-pe-${var.back_office_config.service_bus_name}-sb-${var.environment}" # / could use local.service_bus.name instead
  resource_group_name = azurerm_resource_group.primary.name
  location            = module.primary_region.location
  subnet_id           = azurerm_subnet.main.id

  private_dns_zone_group {
    name                 = "pins-pdns-${var.back_office_config.service_bus_name}-sb-${var.environment}"
    private_dns_zone_ids = [data.azurerm_private_dns_zone.service_bus.id]
  }

  private_service_connection {
    name                           = "pins-psc-${var.back_office_config.service_bus_name}-sb-${var.environment}"
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
