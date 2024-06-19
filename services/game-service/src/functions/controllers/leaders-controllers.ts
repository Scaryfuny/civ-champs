import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {getAllLeadersData} from "../services/leaders-service";

export async function getAllLeaders(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Get all leaders requested"`);

    const leaders = getAllLeadersData();
    return {body: JSON.stringify(leaders), headers: {'Content-Type': 'text/json'}};
}