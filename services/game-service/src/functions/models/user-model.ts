interface UserModel {
    accountName: string,
    rankingScore: number,
    statistics: {
        totalGamesCount: number,
        totalWinsCount: number,
        winRate: number,
        positiveResultCount: number,
        positiveResultRate: number
    }
}