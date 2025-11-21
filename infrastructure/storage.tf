data "azurerm_storage_account" "back_office" {
  name                = var.back_office_config.storage_account_name
  resource_group_name = var.back_office_config.resource_group_name
}

# storage container for dco portal
resource "azurerm_storage_container" "documents" {
  #TODO: Logging
  #checkov:skip=CKV2_AZURE_21 Logging not implemented yet
  name                  = "dco-portal-documents"
  storage_account_id    = data.azurerm_storage_account.back_office.id
  container_access_type = "private"
}

# assign the portal app contributor access to the container
resource "azurerm_role_assignment" "portal_documents_rbac" {
  scope                = azurerm_storage_container.documents.resource_manager_id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = module.app_portal.principal_id
}

# Storage account for service bus function app
resource "azurerm_storage_account" "functions" {
  #TODO: Customer Managed Keys
  #checkov:skip=CKV2_AZURE_1: Customer Managed Keys not implemented yet
  #checkov:skip=CKV2_AZURE_18: Customer Managed Keys not implemented yet
  #TODO: Logging
  #checkov:skip=CKV_AZURE_33: Logging not implemented yet
  #checkov:skip=CKV2_AZURE_8: Logging not implemented yet
  #TODO: Access restrictions
  #checkov:skip=CKV_AZURE_35: Network access restrictions
  #checkov:skip=CKV_AZURE_43: "Ensure Storage Accounts adhere to the naming rules"
  #checkov:skip=CKV_AZURE_59: TODO: Ensure that Storage accounts disallow public access
  #checkov:skip=CKV_AZURE_206: TODO: Ensure that Storage Accounts use replication
  #checkov:skip=CKV2_AZURE_33: "Ensure storage account is configured with private endpoint"
  #checkov:skip=CKV2_AZURE_38: "Ensure soft-delete is enabled on Azure storage account"
  #checkov:skip=CKV2_AZURE_40: "Ensure storage account is not configured with Shared Key authorization"
  #checkov:skip=CKV2_AZURE_41: "Ensure storage account is configured with SAS expiration policy"

  name                             = "pinsstfuncdco${locals.environment}"
  resource_group_name              = azurerm_resource_group.primary.name
  location                         = module.primary_region.location
  account_tier                     = "Standard"
  account_replication_type         = "LRS"
  allow_nested_items_to_be_public  = false
  cross_tenant_replication_enabled = false
  https_traffic_only_enabled       = true

  tags = local.tags
}
