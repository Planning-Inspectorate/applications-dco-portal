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
  function_node_version = var.apps_config.functions.node_version
  app_settings = {
    ServiceBusConnection__fullyQualifiedNamespace    = "${var.back_office_config.service_bus_name}.servicebus.windows.net"
    SQL_CONNECTION_STRING                            = local.key_vault_refs["sql-app-connection-string"]
    SERVICE_USER_TOPIC                               = data.azurerm_servicebus_topic.service_user.name
    SERVICE_USER_SUBSCRIPTION                        = azurerm_servicebus_subscription.service_user_subscription.name
    NSIP_PROJECT_TOPIC                               = data.azurerm_servicebus_topic.nsip_project.name
    NSIP_PROJECT_SUBSCRIPTION                        = azurerm_servicebus_subscription.nsip_project_subscription.name
    DCO_PORTAL_DATA_SUBMISSIONS_PROJECT_TOPIC        = azurerm_servicebus_topic.nsip_project.name
    DCO_PORTAL_DATA_SUBMISSIONS_PROJECT_SUBSCRIPTION = data.azurerm_servicebus_subscription.nsip_project_subscription.name

    # gov notify
    GOV_NOTIFY_DISABLED                      = var.apps_config.gov_notify.disabled
    GOV_NOTIFY_API_KEY                       = local.key_vault_refs["dcop-gov-notify-api-key"]
    GOV_NOTIFY_ANTI_VIRUS_FAILED_TEMPLATE_ID = var.apps_config.gov_notify.templates.anti_virus_failed_template_id
  }
}

resource "azurerm_servicebus_subscription" "service_user_subscription" {
  name                                 = "service-user-dco-portal-sub"
  topic_id                             = data.azurerm_servicebus_topic.service_user.id
  max_delivery_count                   = 1
  dead_lettering_on_message_expiration = true
  default_message_ttl                  = var.sb_ttl.service_user
}

resource "azurerm_servicebus_subscription" "nsip_project_subscription" {
  name                                 = "nsip-project-dco-portal-sub"
  topic_id                             = data.azurerm_servicebus_topic.nsip_project.id
  max_delivery_count                   = 1
  dead_lettering_on_message_expiration = true
  default_message_ttl                  = var.sb_ttl.nsip_project
}

resource "azurerm_servicebus_topic" "dco_portal_data_submissions_project" {
  name                = var.sb_topic_names.applications.events.dco_portal_data_submissions_project
  namespace_id        = data.azurerm_servicebus_namespace.back_office.id
  default_message_ttl = var.sb_ttl.default
}

resource "azurerm_eventgrid_event_subscription" "malware_scan_results" {
  name  = "malware-scan-results-subscription-${local.resource_suffix}"
  scope = data.azurerm_eventgrid_topic.back_office_malware_scanning.id

  azure_function_endpoint {
    function_id                       = "${module.function_integration.app_id}/functions/malware-detection"
    max_events_per_batch              = 1
    preferred_batch_size_in_kilobytes = 64
  }
  advanced_filter {
    string_begins_with {
      key = "data.blobUri"
      values = [
        "${data.azurerm_storage_account.back_office.primary_blob_endpoint}${azurerm_storage_container.documents.name}/",
      ]
    }
  }
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
