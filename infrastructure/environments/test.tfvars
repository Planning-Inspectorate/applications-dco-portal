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
    level = "info"
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
    disabled = false
  }
}

auth_config = {
  auth_enabled   = true
  auth_client_id = "2f5cb0e8-5df8-49f4-8fa7-c3277a0a8632" # App Registration for Auth registration
  application_id = "b40aea38-d056-41d4-973e-8e8c1807ec76" # App Registration for DCO deployment Test
}

back_office_config = {
  resource_group_name  = "pins-rg-back-office-test-ukw-001"
  storage_account_name = "pinsstdocsbotestukw001"
}

common_config = {
  resource_group_name = "pins-rg-common-test-ukw-001"
  action_group_names = {
    iap      = "pins-ag-odt-iap-test"
    its      = "pins-ag-odt-its-test"
    info_sec = "pins-ag-odt-info-sec-test"
  }
}

environment = "test"

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

vnet_config = {
  address_space                       = "10.31.4.0/22"
  apps_subnet_address_space           = "10.31.4.0/24"
  main_subnet_address_space           = "10.31.5.0/24"
  secondary_address_space             = "10.31.20.0/22"
  secondary_apps_subnet_address_space = "10.31.20.0/24"
  secondary_subnet_address_space      = "10.31.21.0/24"
}

waf_rate_limits = {
  enabled             = true
  duration_in_minutes = 5
  threshold           = 1500
}

web_domains = {
  portal = "dco-portal-test.planninginspectorate.gov.uk"
}
