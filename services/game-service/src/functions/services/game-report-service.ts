import {NewGameReportRequestValidator} from "./validators/new-game-report-request-validator";

export class GameReportService {

    private gameReportValidator: NewGameReportRequestValidator;

    constructor() {
        this.gameReportValidator = new NewGameReportRequestValidator();
    }

    createGameReport(request: NewGameReportRequest): void {
        if (!this.gameReportValidator.validate(request)) {
            throw new Error('Invalid game report');
        }

        // save to CosmosDB
    }

    getAllGameReports(): GameReportModel[] {
        return [
            {
                players: [
                    {
                        playerId: "1",
                        playerName: "Max",
                        playerRank: 1,
                        playerScore: 1000,
                        playerLeader: "Leader One",
                        winCondition: "Condition One"
                    },
                    {
                        playerId: "2",
                        playerName: "John",
                        playerRank: 2,
                        playerScore: 2000,
                        playerLeader: "Leader Two",
                        winCondition: "Condition Two"
                    }
                ]
            },
            {
                players: [
                    {
                        playerId: "3",
                        playerName: "Brad",
                        playerRank: 3,
                        playerScore: 3000,
                        playerLeader: "Leader Three",
                        winCondition: "Condition Three"
                    },
                    {
                        playerId: "4",
                        playerName: "Luke",
                        playerRank: 4,
                        playerScore: 4000,
                        playerLeader: "Leader Four",
                        winCondition: "Condition Four"
                    }
                ]
            },
            {
                players: [
                    {
                        playerId: "5",
                        playerName: "Eve",
                        playerRank: 5,
                        playerScore: 5000,
                        playerLeader: "Leader Five",
                        winCondition: "Condition Five"
                    },
                    {
                        playerId: "6",
                        playerName: "Alice",
                        playerRank: 6,
                        playerScore: 6000,
                        playerLeader: "Leader Six",
                        winCondition: "Condition Six"
                    }
                ]
            }
        ];
    }
}