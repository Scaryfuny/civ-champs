import {NewGameReportRequestValidator} from "./validators/new-game-report-request-validator";
import {inject, injectable} from "inversify";
import {DatabaseConnection} from "./database/database-connection";
import {Db} from "mongodb";
import {InvocationContext} from "@azure/functions";
import {UserService} from "./user-service";

@injectable()
export class GameReportService {

    constructor(@inject(NewGameReportRequestValidator) private gameReportValidator: NewGameReportRequestValidator,
                @inject(UserService) private userService: UserService,
                @inject(DatabaseConnection) private databaseConnection: DatabaseConnection) {
    }

    async createGameReport(newGameReportRequest: NewGameReportRequest, context: InvocationContext): Promise<void> {
        try {
            await this.gameReportValidator.validate(newGameReportRequest);
            const db: Db = await this.databaseConnection.getDB();

            const playersGameStats = newGameReportRequest.players;

            //find all users for given game
            const playersModels = await this.userService.findUsersByIds(playersGameStats.map(player => player.player));
            // context.log(`Players for this game found: ${JSON.stringify(playersModels)}`)

            // calculate average game score
            // let averageGameScore = playersGameStats.reduce((acc, player) => acc + player.playerScore, 0) / playersGameStats.length;

            //find minimal and max score
            let minGameScore = playersGameStats.reduce((acc, player) => Math.min(acc, player.playerScore), Number.MAX_SAFE_INTEGER);
            let maxGameScore = playersGameStats.reduce((acc, player) => Math.max(acc, player.playerScore), Number.MIN_SAFE_INTEGER);
            let minVsMaxScoresDifference = maxGameScore - minGameScore;

            //calculate avg ranking of all users
            let averagePlayersRank = playersModels.reduce((acc, player) => acc + player.rankingScore, 0) / playersModels.length;

            context.log(`Game score report: Min score : ${minGameScore}, Max score: ${maxGameScore}, Avg Players Rank: ${averagePlayersRank}`);

            const rankMaxDifference = 1000;

            const maxPointsCanBeChanged = 100;
            const minPointsCanBeChanged = 20;
            const additionalPointsForWinCondition = 20;

            //for each player
            for (let player of playersGameStats) {
                let thisPlayerModel = playersModels.find(playerModel => playerModel.accountName === player.player);

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
                let isPlayerWinner = this.gameReportValidator.validWinCondition(player.winCondition);
                let isPlayerInFirstHalf = relativePlayerVictoryPoints > 0;

                if (isPlayerWinner) {
                    gameRankDifferenceToBeApplied += additionalPointsForWinCondition;
                }

                //round to integer gameRankDifferenceToBeApplied
                gameRankDifferenceToBeApplied = Math.round(gameRankDifferenceToBeApplied);

                let newRank = thisPlayerModel.rankingScore + gameRankDifferenceToBeApplied;
                context.log(`Player ${player.player} earned ${gameRankDifferenceToBeApplied}, New rank: ${newRank}`);

                thisPlayerModel.rankingScore = newRank;
                thisPlayerModel.statistics.totalGamesCount++;
                if (isPlayerWinner) {
                    thisPlayerModel.statistics.totalWinsCount++;
                }
                thisPlayerModel.statistics.winRate = Math.round(thisPlayerModel.statistics.totalWinsCount / thisPlayerModel.statistics.totalGamesCount);
                if (isPlayerInFirstHalf) {
                    thisPlayerModel.statistics.firstHalfResultCount++;
                }

                await this.userService.updateUser(thisPlayerModel, context);
            }

            // create game report
            await db.collection('game-reports').insertOne({
                players: playersGameStats
            });

        } catch (e) {
            throw new Error(`Error creating game report: ${e.message}`);
        }
    }

    async getAllGameReports(): Promise<GameReportModel[]> {
        // const db: Db = await this.databaseConnection.getDB();
        // return await db.collection('game-reports').find().toArray();
        return [];
    }
}