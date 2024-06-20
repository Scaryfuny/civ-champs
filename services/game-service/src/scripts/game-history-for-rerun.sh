curl --request POST -sL \
  --data '{
              "playersResults": [
                  {
                      "player": "Ingvar",
                      "playerScore": 514,
                      "playerLeader": "Cleopatra (Ptolemaic)",
                      "winCondition" : "none"
                  },

                  {
                      "player": "untdofman",
                      "playerScore": 640,
                      "playerLeader": "Nader Shah",
                      "winCondition": "none"
                  },
                  {
                      "player": "DeadVoodoo",
                      "playerScore": 442,
                      "playerLeader": "Gitarja",
                      "winCondition": "none"
                  },
                  {
                      "player": "Baurman",
                      "playerScore": 624,
                      "playerLeader": "Qin Shi Huang (Unifier)",
                      "winCondition": "none"
                  },
                  {
                      "player": "Ayzrian",
                      "playerScore": 727,
                      "playerLeader": "Trajan",
                      "winCondition": "none"
                  },
                  {
                      "player": "Shakespeare",
                      "playerScore": 793,
                      "playerLeader": "Lady Six Sky",
                      "winCondition": "Score"
                  }
              ]
          }'\
     --url 'http://localhost:7071/api/game-reports'