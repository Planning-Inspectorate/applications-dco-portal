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
    level = "warn"
  }

  redis = {
    capacity = 0
    family   = "C"
    sku_name = "Basic"
  }

  gov_notify = {
    disabled = false
    templates = {
      otp_template_id = "88eb5326-aa5a-4dc4-9a91-9a06953fb45a"
    }
  }
}

sql_config = {
  admin = {
    login_username = "pins-dcop-sql-training"
    object_id      = "bb5adccf-8335-40c0-94ac-1286e1962335"
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

environment = "training"

vnet_config = {
  address_space                       = "10.31.8.0/22"
  apps_subnet_address_space           = "10.31.8.0/24"
  main_subnet_address_space           = "10.31.9.0/24"
  secondary_address_space             = "10.31.24.0/22"
  secondary_apps_subnet_address_space = "10.31.24.0/24"
  secondary_subnet_address_space      = "10.31.25.0/24"
}

# web_domains = {
#   web = "https://dco-portal-training.planninginspectorate.gov.uk"
# }
