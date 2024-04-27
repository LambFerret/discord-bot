"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Config_1 = require("./Config");
const uri = Config_1.CONFIG.MONGO_URI;
const databaseName = "myDatabase";
const collectionName = "servers";
class MongoConnect {
    static instance;
    client;
    constructor() {
        this.client = new mongodb_1.MongoClient(Config_1.CONFIG.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    static getInstance() {
        if (!MongoConnect.instance) {
            MongoConnect.instance = new MongoConnect();
        }
        return MongoConnect.instance;
    }
    getCollection() {
        return this.client.db().collection(collectionName);
    }
    async connect() {
        await this.client.connect();
        console.log("MongoDB connected");
    }
    async disconnect() {
        await this.client.close();
        console.log("MongoDB disconnected");
    }
}
exports.default = MongoConnect;
//# sourceMappingURL=MongoConnect.js.map