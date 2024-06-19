import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {UserService} from "../services/user-service";

export async function getAllUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Get all users requested..."`);

    const userService = new UserService();
    try {
        const users = await userService.getAllUsers(context);
        context.log(`${users.length} users found.`);
        return {body: JSON.stringify(users), headers: {'Content-Type': 'text/json'}};
    } catch (e) {
        context.error(`Error getting users: ${e.message}`);
        return {status: 500, body: e.message, headers: {'Content-Type': 'text'}};
    }
}

export async function createUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log("Create user requested...");
    try {
        const newUser: NewUserRequest = JSON.parse(await request.text());

        context.log(`Request body: ${JSON.stringify(newUser)}`);

        const userService = new UserService();

        await userService.createUser(newUser, context);

        context.log(`New user was created: ${newUser.accountName}`);
        return {status: 201, body: "New user was created", headers: {'Content-Type': 'text'}};
    } catch (e) {
        context.error(`Error creating user: ${e.message}`);
        return {status: 400, body: e.message, headers: {'Content-Type': 'text'}};
    }
}