interface GameReportResultModel {
    averageGameScore: number,
    players: PlayerGameReportModel[],
    creationDate: Date
}

interface PlayerGameReportModel {
    playerName: string
    playerScore: number,
    playerLeader: string,

    results: {
        playerRankCompareToAverage: number,
        playerRankChange: number,

        isPositiveResult: boolean,
        isWinner: boolean,
        winCondition: string,
    }
}