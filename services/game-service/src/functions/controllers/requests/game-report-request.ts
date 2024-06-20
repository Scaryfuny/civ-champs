interface GameReportRequest {
    playersResults: PlayerGameReportResult[]
}

interface PlayerGameReportResult {
    player: string,
    playerScore: number,
    playerLeader: string,
    winCondition: string,
}