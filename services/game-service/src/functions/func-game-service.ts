import {app} from "@azure/functions";
import {createGameReport, getGameReports} from "./request-handlers/game-report-handler";
import {createUser, getAllUsers} from "./request-handlers/user-handler";

app.http('createUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: "users",
    handler: createUser
});
app.http('getAllUsers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: "users",
    handler: getAllUsers
});


app.http('getGameReports', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: "game-reports",
    handler: getGameReports
});
app.http('createGameReport', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: "game-reports",
    handler: createGameReport
});