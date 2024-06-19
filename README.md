This project is tournaments, scores and ranks management solution for Civilization games series.

Key functionality:
- create user account
- login (optionally - via Steam account (maybe Google?))
- see leaderboard of players, your rank, game stat and position
- submit game report or validate game report submitted by other players with you in the game
- after validation, the system will adjust game rankings for players
- see the history of games played
- periodically, the system will recalculate players rankings based on the games played


Project structure
- /civ-champs
  - /front (Next.js code)
  - /services (Azure Functions code)
  - /db (Cosmos DB setup and scripts)
  - /infra (Terraform scripts)

Local env set up
- Install Node.js https://nodejs.org/en/download
  - for macOS: `brew install node`
- Install TypeScript: `npm install -g typescript`
- Install Azure CLI https://learn.microsoft.com/en-us/cli/azure/install-azure-cli
  - for macOS: `brew install azure-cli`
- Install Azure Functions Core Tools https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local
  - for macOS: `brew tap azure/functions && brew install azure-functions-core-tools@4`
- Install Terraform https://developer.hashicorp.com/terraform/install
  - for macOS: `brew tap hashicorp/tap && brew install hashicorp/tap/terraform`

Commands:

Infrastructure:
- `terraform init` - initialize Terraform
- `terraform plan` - show the plan of changes
- `terraform apply` - apply the changes

Local development:
Run:
- Run Services:
  - `cd services/game-service-apis`
  - `func start` - run Azure Functions locally

Deploy:
- Deploy Services:
  - `cd services/game-service-apis`
  - `func azure functionapp publish func-game-service-apis-dev` - deploy Azure Functions to Azure
