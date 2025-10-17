auth_config = {
  auth_enabled   = false
  auth_client_id = "2f5cb0e8-5df8-49f4-8fa7-c3277a0a8632" # App Registration for Auth registration
  application_id = "d597841a-bf3a-491f-908f-d581d1999b17" # App Registration for DCO deployment Prod
}

environment = "prod"

front_door_config = {
  name        = "pins-fd-common-tooling"
  rg          = "pins-rg-common-tooling"
  ep_name     = "pins-fde-applications"
  use_tooling = false
}

sql_config = {
  admin = {
    login_username = "pins-dcop-sql-prod"
    object_id      = "32defba1-8893-4189-b298-935ad070c58d"
  }
  sku_name    = "Basic"
  max_size_gb = 2
  retention = {
    audit_days             = 7
    short_term_days        = 7
    long_term_weekly       = "P1W"
    long_term_monthly      = "P1M"
    long_term_yearly       = "P1Y"
    long_term_week_of_year = 1
  }
}

vnet_config = {
  address_space                       = "10.31.12.0/22"
  apps_subnet_address_space           = "10.31.12.0/24"
  main_subnet_address_space           = "10.31.13.0/24"
  secondary_address_space             = "10.31.28.0/22"
  secondary_apps_subnet_address_space = "10.31.28.0/24"
  secondary_subnet_address_space      = "10.31.29.0/24"
}

# web_domains = {
#   portal = "<TBC>.planninginspectorate.gov.uk"
# }
