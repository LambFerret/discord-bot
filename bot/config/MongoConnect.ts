import { ConnectOptions, MongoClient } from "mongodb";
import { CONFIG } from "./Config";

const uri = CONFIG.MONGO_URI as string;
const databaseName = "myDatabase";
const collectionName = "servers";
export default class MongoConnect {
    private static instance: MongoConnect;
    client: MongoClient;
    constructor() {

        this.client = new MongoClient(CONFIG.MONGO_URI as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions);
    }
    public static getInstance(): MongoConnect {
        if (!MongoConnect.instance) {
            MongoConnect.instance = new MongoConnect();
        }
        return MongoConnect.instance;
    }

    public getCollection() {
        return this.client.db(databaseName).collection(collectionName);
    }

    public async connect(): Promise<void> {
        await this.client.connect();
        console.log("MongoDB connected");
    }

    public async disconnect(): Promise<void> {
        await this.client.close();
        console.log("MongoDB disconnected");
    }
}
