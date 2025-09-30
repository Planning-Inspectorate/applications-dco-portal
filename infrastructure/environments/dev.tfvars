apps_config = {
  app_service_plan = {
    sku                      = "P0v3"
    per_site_scaling_enabled = false
    worker_count             = 1
    zone_balancing_enabled   = false
  }
  node_environment         = "development"
  private_endpoint_enabled = true

  functions_node_version = 22

  logging = {
    level = "info"
  }

  redis = {
    capacity = 0
    family   = "C"
    sku_name = "Basic"
  }
}

common_config = {
  resource_group_name = "pins-rg-common-dev-ukw-001"
  action_group_names = {
    iap      = "pins-ag-odt-iap-dev"
    its      = "pins-ag-odt-its-dev"
    info_sec = "pins-ag-odt-info-sec-dev"
  }
}

environment = "dev"

monitoring_config = {
  app_insights_web_test_enabled = false
}

sql_config = {
  admin = {
    login_username = "pins-dcop-sql-dev"
    object_id      = "6189f1d2-9c34-49ac-9c92-4775798622e0"
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
  address_space                       = "10.31.0.0/22"
  apps_subnet_address_space           = "10.31.0.0/24"
  main_subnet_address_space           = "10.31.1.0/24"
  secondary_address_space             = "10.31.16.0/22"
  secondary_apps_subnet_address_space = "10.31.16.0/24"
  secondary_subnet_address_space      = "10.31.17.0/24"
}

# web_domains = {
#   web = "https://dco-portal-dev.planninginspectorate.gov.uk"
# }
