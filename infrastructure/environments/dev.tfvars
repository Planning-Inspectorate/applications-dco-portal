environment = "dev"

vnet_config = {
  address_space                       = "10.31.0.0/22"
  apps_subnet_address_space           = "10.31.0.0/24"
  main_subnet_address_space           = "10.31.1.0/24"
  secondary_address_space             = "10.31.16.0/22"
  secondary_apps_subnet_address_space = "10.31.16.0/24"
  secondary_subnet_address_space      = "10.31.17.0/24"
}
