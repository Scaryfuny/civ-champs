interface GameReportModel {
    players: PlayerGameReportModel[]
}

interface PlayerGameReportModel {
    playerId: string,
    playerName : string
    playerRank: number,
    playerScore: number,
    playerLeader: string,
    winCondition: string,
}