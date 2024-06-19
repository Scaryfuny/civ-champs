import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {GameReportService} from "../services/game-report-service";
import {container} from "../inversify.config";

export async function getGameReports(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Get game reports requested"`);

    const gameReportService = container.get<GameReportService>(GameReportService);
    const gameReports = gameReportService.getAllGameReports();

    return {body: JSON.stringify(gameReports), headers: {'Content-Type': 'text/json'}};
}

export async function createGameReport(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log("Create game report requested...");
    try {
        const newReportRequest: NewGameReportRequest = JSON.parse(await request.text());
        // context.log("New game report: " + JSON.stringify(newReportRequest));

        const gameReportService = container.get<GameReportService>(GameReportService);
        await gameReportService.createGameReport(newReportRequest, context);

        return {status: 201, body: `This game report was submitted successfully.`, headers: {'Content-Type': 'text'}};
    } catch (e) {
        return {status: 400, body: e.message, headers: {'Content-Type': 'text'}};
    }
}

export async function approveGameReport(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log("Approve game report requested...");
    return {status: 200, body: `This game report was approved successfully.`, headers: {'Content-Type': 'text'}};
}