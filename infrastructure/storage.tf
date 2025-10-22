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