import 'reflect-metadata';
import {app} from "@azure/functions";
import {createGameReport, getGameReports, approveGameReport} from "./controllers/game-report-controller";
import {createUser, getAllUsers} from "./controllers/user-controller";
import {getAllLeaders} from "./controllers/leaders-controllers";

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

app.http('getAllLeaders', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: "leaders",
    handler: getAllLeaders
});

app.http('createGameReport', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: "game-reports",
    handler: createGameReport
});
app.http('getGameReports', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: "game-reports",
    handler: getGameReports
});
app.http('approveGameReports', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: "game-reports/{id}/approve",
    handler: approveGameReport
});