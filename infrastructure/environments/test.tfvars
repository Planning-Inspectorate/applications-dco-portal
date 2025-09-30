apps_config = {
  app_service_plan = {
    sku                      = "P0v3"
    per_site_scaling_enabled = false
    worker_count             = 1
    zone_balancing_enabled   = false
  }
  node_environment         = "production"
  private_endpoint_enabled = true

  logging = {
    level = "info"
  }

  redis = {
    capacity = 0
    family   = "C"
    sku_name = "Basic"
  }
}

sql_config = {
  admin = {
    login_username = "pins-dcop-sql-test"
    object_id      = "e9f6bea7-a05e-43d5-8faf-2083b99b79ad"
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

environment = "test"

vnet_config = {
  address_space                       = "10.31.4.0/22"
  apps_subnet_address_space           = "10.31.4.0/24"
  main_subnet_address_space           = "10.31.5.0/24"
  secondary_address_space             = "10.31.20.0/22"
  secondary_apps_subnet_address_space = "10.31.20.0/24"
  secondary_subnet_address_space      = "10.31.21.0/24"
}

# web_domains = {
#   web = "https://dco-portal-test.planninginspectorate.gov.uk"
# }
