import { app } from "@azure/functions";
import {createGameReport, getGames} from "./handlers/handlers";

app.http('getGames', {methods: ['GET'], authLevel: 'anonymous', handler: getGames});
app.http('createGame', {methods: ['POST'], authLevel: 'anonymous', handler: createGameReport});
