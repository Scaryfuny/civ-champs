interface NewGameReportRequest {
    players: PlayerGameReportInfo[]
}

interface PlayerGameReportInfo {
    player: string,
    playerScore: number,
    playerLeader: string,
    winCondition: string,
}