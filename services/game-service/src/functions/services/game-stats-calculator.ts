import {InvocationContext} from "@azure/functions";
import {inject, injectable} from "inversify";
import {UserService} from "./user-service";

@injectable()
export class GameStatsCalculator {

    constructor(@inject(UserService) private userService: UserService) {
    }

    async calculateGameStats(gameReport: GameReportRequest, context: InvocationContext): Promise<GameReportResultModel> {
        const playersGameResult = gameReport.playersResults;

        const playersUsers = await this.userService.findUsersByIds(playersGameResult.map(player => player.player));

        // calculate average game score
        let averageGameScore = Math.round(playersGameResult.reduce((acc, player) => acc + player.playerScore, 0) / playersGameResult.length);

        //find minimal and max score
        let minGameScore = playersGameResult.reduce((acc, player) => Math.min(acc, player.playerScore), Number.MAX_SAFE_INTEGER);
        let maxGameScore = playersGameResult.reduce((acc, player) => Math.max(acc, player.playerScore), Number.MIN_SAFE_INTEGER);
        let minVsMaxScoresDifference = maxGameScore - minGameScore;

        // calculate avg ranking of all users
        let averagePlayersRank = Math.round(playersUsers.reduce((acc, player) => acc + player.rankingScore, 0) / playersUsers.length);

        context.log(`Game score report: Min score : ${minGameScore}, Max score: ${maxGameScore}, Avg Score: ${averageGameScore}, Avg Players Rank: ${averagePlayersRank}`);

        const rankMaxDifference = 1000;

        const maxPointsCanBeChanged = 100;
        const minPointsCanBeChanged = 20;
        const additionalPointsForWinCondition = 20;

        return {
            creationDate: new Date(),
            averageGameScore: averageGameScore,

            // for each player calculate his stats
            players: playersGameResult.map(player => {
                let thisPlayerModel = playersUsers.find(playerModel => playerModel.accountName === player.player);

                //find the difference between player rank and average rank
                let playerRankCompareToAverage = (thisPlayerModel.rankingScore - averagePlayersRank);

                // balance rank difference to max difference allowed. Means in case player is stronger for 1500 points,
                // of average, then rank differences will be hardcoded to 1000, same for negative values.
                // e.g. if -1500 then -1000.
                if (playerRankCompareToAverage > rankMaxDifference) {
                    playerRankCompareToAverage = rankMaxDifference;
                }
                if (playerRankCompareToAverage < -rankMaxDifference) {
                    playerRankCompareToAverage = -rankMaxDifference;
                }

                //find player game score difference from min score in game. Value Will be from 0 to maxGameScore.
                let playerPositiveScoreDifferenceFromMinScore = player.playerScore - minGameScore;

                //find relative player victory points (calculated in percentage from -100% to 100% depends on player positive score)
                let relativePlayerVictoryPoints = ((playerPositiveScoreDifferenceFromMinScore * 100 * 2) / minVsMaxScoresDifference) - 100;

                // calculate max points can be earned for win and lose for this player
                // it's calculated based on player rank difference to average rank
                // example: if player rank is rankMaxDifference above of average rank, then player can earn only minimal points for win
                // same time if he will lose, he can lose max points.
                // for players with ranks lower on rankMaxDifference than average rank, it's opposite. e.g. for lose he will lose minimal points
                // in case of win he will earn max points.
                let maxRankScoreCanBeEarnedForThisGame = maxPointsCanBeChanged -
                    ((rankMaxDifference + playerRankCompareToAverage) * (maxPointsCanBeChanged - minPointsCanBeChanged) /
                        (rankMaxDifference * 2));

                let minRankScoreCanBeLostForThisGame = (minPointsCanBeChanged + maxPointsCanBeChanged) - maxRankScoreCanBeEarnedForThisGame;

                // points calculation for win and lose. It's relative points in percentage from -100% to 100%,
                // multiplied by maxRankScoreCanBeEarnedForThisGame or minRankScoreCanBeLostForThisGame depends on
                // lose or win
                let gameRankDifferenceToBeApplied = relativePlayerVictoryPoints > 0 ?
                    relativePlayerVictoryPoints * maxRankScoreCanBeEarnedForThisGame / 100
                    : relativePlayerVictoryPoints * minRankScoreCanBeLostForThisGame / 100;

                // if player won, then add additional points
                let isPlayerWinner = player.winCondition && player.winCondition != "none";
                let isPositiveResult = relativePlayerVictoryPoints > 0;

                if (isPlayerWinner) {
                    gameRankDifferenceToBeApplied += additionalPointsForWinCondition;
                }

                //round to integer gameRankDifferenceToBeApplied
                gameRankDifferenceToBeApplied = Math.round(gameRankDifferenceToBeApplied);
                return {
                    playerName: player.player,
                    playerScore: player.playerScore,
                    playerLeader: player.playerLeader,

                    results: {
                        playerRankCompareToAverage: playerRankCompareToAverage,
                        playerRankChange: gameRankDifferenceToBeApplied,

                        isPositiveResult: isPositiveResult,
                        isWinner: isPlayerWinner,
                        winCondition: isPlayerWinner ? player.winCondition : "none",
                    }
                }
            })
        };
    }
}