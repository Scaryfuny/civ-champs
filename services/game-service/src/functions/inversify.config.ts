import 'reflect-metadata';
import {Container} from 'inversify';
import {DatabaseConnection} from './services/database/database-connection';
import {UserService} from "./services/user-service";
import {NewGameReportRequestValidator} from "./services/validators/new-game-report-request-validator";
import {GameReportService} from "./services/game-report-service";
import {GameStatsCalculator} from "./services/game-stats-calculator";

const container = new Container();

container.bind(DatabaseConnection).toSelf();
container.bind(UserService).to(UserService);
container.bind(NewGameReportRequestValidator).to(NewGameReportRequestValidator);
container.bind(GameReportService).to(GameReportService);
container.bind(GameStatsCalculator).to(GameStatsCalculator);

export {container};