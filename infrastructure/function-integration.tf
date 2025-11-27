# 📋 TODOs:
## ⭕ We did mention about naming on one or two values but can't remember which ones around service user and nsip user
## ⭕ Choose better naming for: module, app_name and file name? 🤷‍♂️
## ✅ Move some items into a newer file similar to appeals?
## ✅ Remove any appeals references
## ✅ Make changes to the Build pipeline
## ✅ Make changes to the Deploy pipeline
## ✅ removed locals completely from this file and replaced with vars
## ⭕ A new service plan created and added into function.tf; easy change to reference original service plan but this is more accurate
## ✅ networking - subnet, private endpoints, integrate into back office - do we need any further changes? Is this referenced anywhere - made changes in service-bus.tf and variables.tf
## ⭕ data block "service-user/nsip-project" I am pretty sure this is correct and do not need to dive into the resources to grab but simply a string to reference it
## ❓ Do we need linting in build pipeline as well?
## ❓ Role assignements - Should i have two, one for each subscription? 
#### 💡 One should be enougn to get all topics from a namespace. Multiple for multiple namespaces
## ❓ functions_service_plan_sku = "P0v3" # if the plans are the same is it worth having this and the extra resource in function.tf?



module "function_integration" {
  #checkov:skip=CKV_TF_1: Use of commit hash are not required for our Terraform modules
  source = "github.com/Planning-Inspectorate/infrastructure-modules.git//modules/node-function-app?ref=1.53"

  resource_group_name = azurerm_resource_group.primary.name
  location            = module.primary_region.location

  # naming
  app_name        = "function-integration"
  resource_suffix = var.environment
  service_name    = local.service_name
  tags            = local.tags

  # service plan
  app_service_plan_id = azurerm_service_plan.functions.id

  # storage
  function_apps_storage_account            = azurerm_storage_account.functions.name
  function_apps_storage_account_access_key = azurerm_storage_account.functions.primary_access_key

  # networking
  integration_subnet_id      = azurerm_subnet.apps.id
  outbound_vnet_connectivity = true

  # monitoring
  action_group_ids            = local.action_group_ids
  app_insights_instrument_key = azurerm_application_insights.main.instrumentation_key
  log_analytics_workspace_id  = azurerm_log_analytics_workspace.main.id
  monitoring_alerts_enabled   = var.alerts_enabled

  # settings
  function_node_version = var.apps_config.functions_node_version
  app_settings = {
    ServiceBusConnection__fullyQualifiedNamespace = "${var.back_office_config.service_bus_name}.servicebus.windows.net"
    SQL_CONNECTION_STRING                         = local.key_vault_refs["sql-app-connection-string"]
    SERVICE_USER_TOPIC                            = "service-user"
    SERVICE_USER_SUBSCRIPTION                     = azurerm_servicebus_subscription.service_user_subscription.name
    NSIP_PROJECT_TOPIC                            = "nsip-project"
    NSIP_PROJECT_SUBSCRIPTION                     = azurerm_servicebus_subscription.nsip_project_subscription.name
  }
}

resource "azurerm_servicebus_subscription" "service_user_subscription" {
  name                                 = "service-user-dco-portal-sub"
  topic_id                             = "${data.azurerm_servicebus_namespace.back_office_sb.id}/topics/service-user"
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

resource "azurerm_role_assignment" "function_integration_secrets_user" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = module.function_integration.principal_id
}

resource "azurerm_role_assignment" "function_integration_servicebus_data_owner" {
  scope                = data.azurerm_servicebus_namespace.back_office_sb.id
  role_definition_name = "Azure Service Bus Data Receiver"
  principal_id         = module.function_integration.principal_id
}
