apps_config = {
  app_service_plan = {
    sku                      = "P0v3"
    per_site_scaling_enabled = false
    worker_count             = 1
    zone_balancing_enabled   = false
  }
  node_environment         = "production"
  private_endpoint_enabled = true

  functions_node_version = 22

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

  blob_store = {
    disabled = true
  }
}

auth_config = {
  auth_enabled   = true
  auth_client_id = "2f5cb0e8-5df8-49f4-8fa7-c3277a0a8632" # App Registration for Auth registration
  application_id = "89a3813c-357c-4c7b-aced-9d4e6ff5b2f1" # App Registration for DCO deployment Training
}

back_office_config = {
  resource_group_name  = "pins-rg-back-office-training-ukw-001"
  storage_account_name = "pinsstdocsbotrainingukw"
}

common_config = {
  resource_group_name = "pins-rg-common-training-ukw-001"
  action_group_names = {
    iap      = "pins-ag-odt-iap-training"
    its      = "pins-ag-odt-its-training"
    info_sec = "pins-ag-odt-info-sec-training"
  }
}

environment = "training"

front_door_config = {
  name        = "pins-fd-common-tooling"
  rg          = "pins-rg-common-tooling"
  ep_name     = "pins-fde-applications"
  use_tooling = true
}

monitoring_config = {
  app_insights_web_test_enabled = false
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

vnet_config = {
  address_space                       = "10.31.8.0/22"
  apps_subnet_address_space           = "10.31.8.0/24"
  main_subnet_address_space           = "10.31.9.0/24"
  secondary_address_space             = "10.31.24.0/22"
  secondary_apps_subnet_address_space = "10.31.24.0/24"
  secondary_subnet_address_space      = "10.31.25.0/24"
}

waf_rate_limits = {
  enabled             = true
  duration_in_minutes = 5
  threshold           = 1500
}

web_domains = {
  portal = "dco-portal-training.planninginspectorate.gov.uk"
}
