data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "rg_civ_champs" {
  name     = "civ-champs-dev"
  location = "West Europe"
}