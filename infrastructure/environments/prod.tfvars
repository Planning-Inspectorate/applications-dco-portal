environment = "prod"

vnet_config = {
  address_space                       = "10.31.12.0/22"
  apps_subnet_address_space           = "10.31.12.0/24"
  main_subnet_address_space           = "10.31.13.0/24"
  secondary_address_space             = "10.31.28.0/22"
  secondary_apps_subnet_address_space = "10.31.28.0/24"
  secondary_subnet_address_space      = "10.31.29.0/24"
}
