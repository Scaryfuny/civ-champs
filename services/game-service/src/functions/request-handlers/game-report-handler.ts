import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {GameReportService} from "../services/game-report-service";

export async function getGameReports(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Get game reports requested"`);

    const gameReportService = new GameReportService();
    const gameReports = gameReportService.getAllGameReports();

    return {body: JSON.stringify(gameReports), headers: {'Content-Type': 'text/json'}};
}

export async function createGameReport(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log("Create game report requested...");
    try {
        context.log(JSON.stringify(request.body));

        const newReportRequest: NewGameReportRequest = JSON.parse(await request.text());
        const gameService = new GameReportService();

        gameService.createGameReport(newReportRequest);

        return {status: 201, body: `This game report was submitted successfully.`, headers: {'Content-Type': 'text'}};
    } catch (e) {
        return {status: 400, body: e.message, headers: {'Content-Type': 'text'}};
    }
}