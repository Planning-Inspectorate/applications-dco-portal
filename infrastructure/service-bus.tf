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

data "azurerm_private_dns_zone" "service_bus" {
  name                = "privatelink.servicebus.windows.net"
  resource_group_name = var.tooling_config.network_rg

  provider = azurerm.tooling
}

resource "azurerm_private_endpoint" "sb_main" {
  count = data.azurerm_servicebus_namespace.back_office_sb.sku == "Premium" ? 1 : 0

  name                = "pins-pe-${var.back_office_config.service_bus_name}-sb-${var.environment}"
  resource_group_name = azurerm_resource_group.primary.name
  location            = module.primary_region.location
  subnet_id           = azurerm_subnet.main.id

  private_dns_zone_group {
    name                 = "pins-pdns-${var.back_office_config.service_bus_name}-sb-${var.environment}"
    private_dns_zone_ids = [data.azurerm_private_dns_zone.service_bus.id]
  }

  private_service_connection {
    name                           = "pins-psc-${var.back_office_config.service_bus_name}-sb-${var.environment}"
    private_connection_resource_id = data.azurerm_servicebus_namespace.back_office_sb.id
    is_manual_connection           = false
    subresource_names              = ["namespace"]
  }

  tags = local.tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "service_bus" {
  name                  = "${local.org}-vnetlink-service-bus-${local.resource_suffix}"
  resource_group_name   = var.tooling_config.network_rg
  private_dns_zone_name = data.azurerm_private_dns_zone.service_bus.name
  virtual_network_id    = azurerm_virtual_network.main.id

  provider = azurerm.tooling
}
