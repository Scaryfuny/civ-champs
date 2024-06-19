import {InvocationContext} from "@azure/functions";
import {Db, MongoClient} from 'mongodb';

export class UserService {

    private client: MongoClient;
    private db: Db;

    constructor() {
        this.client = new MongoClient(process.env.COSMOS_DB_CONNECTION_STRING);
    }

    private async connect() {
        await this.client.connect();
        this.db = this.client.db('game-db-dev');
    }

    async createUser(user: NewUserRequest, context: InvocationContext): Promise<UserModel> {
        if (!this.db) {
            await this.connect();
        }

        if (!user.accountName) {
            throw new Error("Field 'accountName' is required.");
        }

        const existingUser = await this.db.collection('users').findOne({accountName: user.accountName});
        if (existingUser) {
            throw new Error(`User with account name '${user.accountName}' already exists.`);
        }

        const userModel: UserModel = {
            accountName: user.accountName,
            rankingScore: 1000,
            statistics: {
                totalGamesCount: 0,
                totalWinsCount: 0,
                winRate: 0,
                firstHalfResultCount: 0
            }
        };

        try {
            await this.db.collection('users').insertOne(userModel);
        } catch (e) {
            context.error(`Error creating user with account name '${user.accountName}'`);
            throw new Error(`Error creating user: ${e.message}`);
        }

        return userModel;
    }

    async getAllUsers(context: InvocationContext): Promise<UserModel[]> {
        if (!this.db) {
            await this.connect();
        }

        // Get all users and sort them by rankingScore
        const users = await this.db.collection('users').find().sort({rankingScore: -1}).toArray();

        // Map the returned documents to UserModel objects
        return users.map(user => ({
            accountName: user.accountName,
            rankingScore: user.rankingScore,
            statistics: {
                totalGamesCount: user.statistics.totalGamesCount,
                totalWinsCount: user.statistics.totalWinsCount,
                winRate: user.statistics.winRate,
                firstHalfResultCount: user.statistics.firstHalfResultCount
            }
        }));
    }
}