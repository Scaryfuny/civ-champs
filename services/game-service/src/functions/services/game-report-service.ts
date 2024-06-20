import {NewGameReportRequestValidator} from "./validators/new-game-report-request-validator";
import {inject, injectable} from "inversify";
import {DatabaseConnection} from "./database/database-connection";
import {Db} from "mongodb";
import {InvocationContext} from "@azure/functions";
import {UserService} from "./user-service";
import {GameStatsCalculator} from "./game-stats-calculator";

@injectable()
export class GameReportService {

    constructor(@inject(NewGameReportRequestValidator) private gameReportValidator: NewGameReportRequestValidator,
                @inject(UserService) private userService: UserService,
                @inject(DatabaseConnection) private databaseConnection: DatabaseConnection,
                @inject(GameStatsCalculator) private gameStatsCalculator: GameStatsCalculator) {
    }

    async createGameReport(newGameReportRequest: GameReportRequest, context: InvocationContext): Promise<void> {
        try {
            await this.gameReportValidator.validate(newGameReportRequest);

            const gameReport: GameReportResultModel = await this.gameStatsCalculator.calculateGameStats(newGameReportRequest, context);

            const playersUsers = await this.userService.findUsersByIds(gameReport.players.map(player => player.playerName));

            // for each player calculate his stats
            for (let player of gameReport.players) {
                const thisPlayerModel = playersUsers.find(playerModel => playerModel.accountName === player.playerName);

                thisPlayerModel.rankingScore = thisPlayerModel.rankingScore + player.results.playerRankChange;
                context.log(`Player ${player.playerName} earned ${player.results.playerRankChange}, New rank: ${thisPlayerModel.rankingScore}`);

                thisPlayerModel.statistics.totalGamesCount++;
                if (player.results.isWinner) {
                    thisPlayerModel.statistics.totalWinsCount++;
                }
                thisPlayerModel.statistics.winRate = Math.round(thisPlayerModel.statistics.totalWinsCount / thisPlayerModel.statistics.totalGamesCount * 100);
                if (player.results.isPositiveResult) {
                    thisPlayerModel.statistics.positiveResultCount++;
                }
                thisPlayerModel.statistics.positiveResultRate = Math.round(thisPlayerModel.statistics.positiveResultCount / thisPlayerModel.statistics.totalGamesCount * 100);
            }

            const db: Db = await this.databaseConnection.getDB();

            await db.collection('game-reports').insertOne(gameReport);

            await this.userService.updateUsers(playersUsers, context);

        } catch (e) {
            throw new Error(`Error creating game report: ${e.message}`);
        }
    }

    async getAllGameReports(): Promise<GameReportResultModel[]> {
        // const db: Db = await this.databaseConnection.getDB();
        // return await db.collection('game-reports').find().toArray();
        return [];
    }
}