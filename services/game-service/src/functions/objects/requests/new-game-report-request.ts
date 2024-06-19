interface NewGameReportRequest {
    players: PlayerReportInfo[]
}

interface PlayerReportInfo {
    playerId: string,
    playerRank: number,
    playerScore: number,
    playerLeader: string,
    winCondition: string,
}