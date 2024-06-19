import {InvocationContext} from "@azure/functions";
import {Db} from 'mongodb';
import {DatabaseConnection} from "./database/database-connection";
import {inject, injectable} from "inversify";

@injectable()
export class UserService {

    constructor(@inject(DatabaseConnection) private databaseConnection: DatabaseConnection) {
    }

    async createUser(user: NewUserRequest, context: InvocationContext): Promise<UserModel> {
        const db: Db = await this.databaseConnection.getDB();

        if (!user.accountName) {
            throw new Error("Field 'accountName' is required.");
        }

        const existingUser = await db.collection('users').findOne({accountName: user.accountName});
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
            await db.collection('users').insertOne(userModel);
        } catch (e) {
            context.error(`Error creating user with account name '${user.accountName}'`);
            throw new Error(`Error creating user: ${e.message}`);
        }

        return userModel;
    }

    async getAllUsers(): Promise<UserModel[]> {
        const db: Db = await this.databaseConnection.getDB();

        // Get all users and sort them by rankingScore
        const users = await db.collection('users').find().sort({rankingScore: -1}).toArray();
        return this.convertToUserModel(users);
    }

    private convertToUserModel(users: any[]) {
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

    async isUserExists(player: string): Promise<boolean> {
        const db: Db = await this.databaseConnection.getDB();
        const existingUser = await db.collection('users').findOne({accountName: player});
        return !!existingUser;

    }

    async findUsersByIds(players: string[]): Promise<UserModel[]> {
        const db: Db = await this.databaseConnection.getDB();
        const users = await db.collection('users').find({accountName: {$in: players}}).toArray();

        return this.convertToUserModel(users);
    }

    async updateUser(thisPlayerModel: UserModel, context: InvocationContext) {
        const db: Db = await this.databaseConnection.getDB();
        db.collection('users').updateOne({accountName: thisPlayerModel.accountName}, {
            $set: {
                rankingScore: thisPlayerModel.rankingScore,
                statistics: {
                    totalGamesCount: thisPlayerModel.statistics.totalGamesCount,
                    totalWinsCount: thisPlayerModel.statistics.totalWinsCount,
                    winRate: thisPlayerModel.statistics.winRate,
                    firstHalfResultCount: thisPlayerModel.statistics.firstHalfResultCount
                }
            }
        }).then(() => {
        }).catch((e) => {
            context.error(`Error updating user ${thisPlayerModel.accountName}`);
            throw new Error(`Error updating user: ${e.message}`);
        });
    }
}