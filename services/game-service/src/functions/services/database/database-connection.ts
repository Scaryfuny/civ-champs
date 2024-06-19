import {Db, MongoClient} from 'mongodb';
import {injectable} from 'inversify';

@injectable()
export class DatabaseConnection {
    private db: Db;

    public async getDB(): Promise<Db> {
        if (!this.db) {
            const client = new MongoClient(process.env.COSMOS_DB_CONNECTION_STRING);
            await client.connect();
            this.db = client.db('game-db-dev');
        }
        return this.db;
    }
}