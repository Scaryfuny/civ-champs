import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {getUserGames} from "../src/gameService";

export async function getGames(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Get games requested"`);

    const games = getUserGames();

    return {body: JSON.stringify(games), headers: {'Content-Type': 'text/json'}};
}

export async function createGameReport(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Create game report requested"`);

    const name = request.query.get('name') || await request.text() || 'world';

    return {body: `Hello, ${name}!`, headers: {'Content-Type': 'text/json'}};
}