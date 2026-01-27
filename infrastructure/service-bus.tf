data "azurerm_servicebus_namespace" "back_office_sb" {
  name                = var.back_office_config.service_bus_name
  resource_group_name = var.back_office_config.resource_group_name
}

data "azurerm_servicebus_topic" "service_user" {
  name         = var.sb_topic_names.service_user
  namespace_id = data.azurerm_servicebus_namespace.back_office_sb.id
}

data "azurerm_servicebus_topic" "nsip_project" {
  name         = var.sb_topic_names.nsip_project
  namespace_id = data.azurerm_servicebus_namespace.back_office_sb.id
}

data "azurerm_servicebus_topic" "dco_portal_data_submissions" {
  name         = var.sb_topic_names.dco_portal_data_submissions
  namespace_id = data.azurerm_servicebus_namespace.back_office_sb.id
}

data "azurerm_private_dns_zone" "service_bus" {
  name                = "privatelink.servicebus.windows.net"
  resource_group_name = var.tooling_config.network_rg

  provider = azurerm.tooling
}

resource "azurerm_private_dns_zone_virtual_network_link" "service_bus" {
  name                  = "${local.org}-vnetlink-service-bus-${local.resource_suffix}"
  resource_group_name   = var.tooling_config.network_rg
  private_dns_zone_name = data.azurerm_private_dns_zone.service_bus.name
  virtual_network_id    = azurerm_virtual_network.main.id

  provider = azurerm.tooling
}
