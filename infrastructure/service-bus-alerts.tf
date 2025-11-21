locals {
  # action group keys from var.common_config.action_group_names
  # keys in this object used for alert name
  # max five action groups per alert

## Not sure on any of these values, but have matched up with vars, but not tfvars.

  sb_alerts = {
    # DCO submissions
    "Submissions" = {
      topics = [
        var.sb_topic_names.submissions.appellant,
        var.sb_topic_names.submissions.lpa_questionnaire
      ],
      action_groups = [
        "tech",
        "service_manager"
      ]
    },
    "Broadcasts" = {
      topics = [
        var.sb_topic_names.events.document,
        var.sb_topic_names.events.service_user
      ],
      action_groups = [
        "tech",
        "service_manager"
      ]
    },
    "Internal" = {
      topics = [
        var.sb_topic_names.events.document_to_move
      ],
      action_groups = [
        "tech",
        "service_manager"
      ]
    }
  }
}

resource "azurerm_monitor_metric_alert" "sb_dead_letter_alerts" {
  for_each = local.sb_alerts

  name                = "Dead Letter Alert - ${each.key} - ${local.service_bus.name}" # would need this edited to match service bus name. Appeals uses local for test and default
  resource_group_name = azurerm_resource_group.primary.name
  scopes              = [local.service_bus.id]
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

    dimension { # separate alerts by topic
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
