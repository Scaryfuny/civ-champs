resource "azurerm_cosmosdb_account" "cosmos-db" {
  name                = "cos-game-service-db"
  resource_group_name = azurerm_resource_group.rg_civ_champs.name
  location            = azurerm_resource_group.rg_civ_champs.location
  offer_type          = "Standard"
  kind                = "MongoDB"

  free_tier_enabled = true

  mongo_server_version = "4.2"

  capabilities {
    name = "EnableMongo"
  }
  capabilities {
    name = "EnableServerless"
  }

  consistency_policy {
    consistency_level       = "Session"
    max_interval_in_seconds = 10
    max_staleness_prefix    = 200
  }

  geo_location {
    location          = azurerm_resource_group.rg_civ_champs.location
    failover_priority = 0
  }
}

resource "azurerm_cosmosdb_mongo_database" "game-db" {
  name                = "game-db-dev"
  resource_group_name = azurerm_cosmosdb_account.cosmos-db.resource_group_name
  account_name        = azurerm_cosmosdb_account.cosmos-db.name
}

resource "azurerm_cosmosdb_mongo_collection" "users" {
  name                = "users"
  resource_group_name = azurerm_cosmosdb_account.cosmos-db.resource_group_name
  account_name        = azurerm_cosmosdb_account.cosmos-db.name
  database_name       = azurerm_cosmosdb_mongo_database.game-db.name

  index {
    keys = ["_id"]
    unique = true
  }
  index {
    keys = ["accountName"]
    unique = true
  }
  index {
    keys = ["rankingScore"]
  }
}

resource "azurerm_cosmosdb_mongo_collection" "game-reports" {
  name                = "game-reports"
  resource_group_name = azurerm_cosmosdb_account.cosmos-db.resource_group_name
  account_name        = azurerm_cosmosdb_account.cosmos-db.name
  database_name       = azurerm_cosmosdb_mongo_database.game-db.name

  index {
    keys = ["_id"]
    unique = true
  }
}