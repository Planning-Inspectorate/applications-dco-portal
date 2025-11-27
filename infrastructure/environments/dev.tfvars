apps_config = {
  app_service_plan = {
    sku                      = "P0v3"
    per_site_scaling_enabled = false
    worker_count             = 1
    zone_balancing_enabled   = false
  }
  blob_store = {
    disabled = false
  }

  functions_service_plan_sku = "P0v3" # if the plans are the same is it worth having this and the extra resource in function.tf?
  functions_node_version     = 22

  gov_notify = {
    disabled = false
    templates = {
      otp_template_id = "88eb5326-aa5a-4dc4-9a91-9a06953fb45a"
    }
  }
  logging = {
    level = "info"
  }
  node_environment         = "development"
  private_endpoint_enabled = true
  redis = {
    capacity = 0
    family   = "C"
    sku_name = "Basic"
  }
}

alerts_enabled = false

auth_config = {
  auth_enabled   = true
  auth_client_id = "2f5cb0e8-5df8-49f4-8fa7-c3277a0a8632" # App Registration for Auth registration
  application_id = "eef9a9e5-6726-442b-912a-fb7479d93e12" # App Registration for DCO deployment Dev
}

back_office_config = {
  resource_group_name  = "pins-rg-back-office-dev-ukw-001"
  storage_account_name = "pinsstdocsbodevukw001"
  service_bus_name     = "pins-sb-back-office-dev-ukw-001"
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

front_door_config = {
  name        = "pins-fd-common-tooling"
  rg          = "pins-rg-common-tooling"
  ep_name     = "pins-fde-applications"
  use_tooling = true
}

monitoring_config = {
  app_insights_web_test_enabled = false
  log_daily_cap                 = 0.1
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

# 🚨 Not needed as we are not creating this resource but simply using data blocks to read what already exists
# service_bus_config = {
#   sku                           = "Standard"
#   capacity                      = 0
#   public_network_access_enabled = true
# }

sb_ttl = {
  default      = "P3D"
  service_user = "P1D"
  nsip_project = "P1D"
}

# sb_topic_names = {
#   submissions = {
#     service_user = "service-user-topic"
#     nsip_project = "nsip-project-topic"
#   }
#   Broadcasts = {
#     service_user = "service-user-topic"
#   nsip_project = "nsip-project-topic" }

#   Internal = {
#     service_user = "service-user-topic"
#     nsip_project = "nsip-project-topic"
#   }
# }

sb_topic_names_small = {
  service_user = "service-user-topic"
  nsip_project = "nsip-project-topic"
}

vnet_config = {
  address_space                       = "10.31.0.0/22"
  apps_subnet_address_space           = "10.31.0.0/24"
  main_subnet_address_space           = "10.31.1.0/24"
  secondary_address_space             = "10.31.16.0/22"
  secondary_apps_subnet_address_space = "10.31.16.0/24"
  secondary_subnet_address_space      = "10.31.17.0/24"
}

waf_rate_limits = {
  enabled             = true
  duration_in_minutes = 5
  threshold           = 1500
}

web_domains = {
  portal = "dco-portal-dev.planninginspectorate.gov.uk"
}
