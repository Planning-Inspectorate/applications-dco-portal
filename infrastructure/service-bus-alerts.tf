locals {
  # action group keys from var.common_config.action_group_names
  # keys in this object used for alert name
  # max five action groups per alert
  # sb_alerts = {
  #   "Submissions" = {
  #     topics = [
  #       var.sb_topic_names.service_user,
  #       var.sb_topic_names.nsip_project
  #     ],
  #     action_groups = [
  #       "tech",
  #       "service_manager"
  #     ]
  #   },
  #   "Broadcasts" = {
  #     topics = [
  #       var.sb_topic_names.service_user,
  #       var.sb_topic_names.nsip_project
  #     ],
  #     action_groups = [
  #       "tech",
  #       "service_manager"
  #     ]
  #   },
  #   "Internal" = {
  #     topics = [
  #       var.sb_topic_names.service_user,
  #       var.sb_topic_names.nsip_project
  #     ],
  #     action_groups = [
  #       "tech",
  #       "service_manager"
  #     ]
  #   }
  # }
  sb_alerts_small = {
    topics = [
      var.sb_topic_names.service_user,
      var.sb_topic_names.nsip_project
    ],
    action_groups = [
      "tech",
      "service_manager"
    ]
  }
}

resource "azurerm_monitor_metric_alert" "sb_dead_letter_alerts" {
  for_each = local.sb_alerts_small

  name                = "Dead Letter Alert - ${each.key} - ${var.back_office_config.service_bus_name}"
  resource_group_name = azurerm_resource_group.primary.name
  scopes              = [data.azurerm_servicebus_namespace.back_office_sb.id]
  description         = "Triggered when messages are added to dead-letter queue"
  severity            = 1
  frequency           = "PT5M"
  window_size         = "PT15M"

  criteria {
    metric_namespace = "Microsoft.ServiceBus/namespaces"

    metric_name = "DeadletteredMessages"
    aggregation = "Minimum"
    operator    = "GreaterThanOrEqual"
    threshold   = 1 # any dead-lettered messages

    dimension {
      name     = "EntityName"
      operator = "Include"
      values   = each.value["topics"]
    }
  }

  dynamic "action" {
    for_each = each.value["action_groups"]
    iterator = action_group_key

    content {
      action_group_id = data.azurerm_monitor_action_group.common[action_group_key.value].id
    }
  }
}
