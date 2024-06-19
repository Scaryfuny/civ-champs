resource "azurerm_storage_account" "stg_civ_champs" {
  name                     = "stgcivchampsdev"
  resource_group_name      = azurerm_resource_group.rg_civ_champs.name
  location                 = azurerm_resource_group.rg_civ_champs.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "asp_civ_champs" {
  name                = "asp-civ-champs-dev"
  location            = azurerm_resource_group.rg_civ_champs.location
  resource_group_name = azurerm_resource_group.rg_civ_champs.name
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_linux_function_app" "func-game-service-apis" {
  name                = "func-game-service-apis-dev"
  location            = azurerm_resource_group.rg_civ_champs.location
  resource_group_name = azurerm_resource_group.rg_civ_champs.name

  service_plan_id            = azurerm_service_plan.asp_civ_champs.id
  storage_account_name       = azurerm_storage_account.stg_civ_champs.name
  storage_account_access_key = azurerm_storage_account.stg_civ_champs.primary_access_key

  site_config {
    application_stack {
      node_version = "20"
    }
  }
}