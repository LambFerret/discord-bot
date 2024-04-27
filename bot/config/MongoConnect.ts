import { ConnectOptions, MongoClient } from "mongodb";
import { CONFIG } from "./Config";
import mongoose, { Schema } from "mongoose";
import { ServerInfo } from "../model/ServerType";

const uri = CONFIG.MONGO_URI as string;
const databaseName = "myDatabase";
const collectionName = "servers";
const archiveCollectionName = "archive";
// 문서의 인터페이스 정의 (Mongoose + TypeScript)
interface IServer extends Document, ServerInfo { }

// 스키마 정의
const ServerSchema: Schema = new Schema({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    createdDate: { type: Date, required: true },
    OwnerId: { type: String, required: true },
    detectChannel: { type: String, required: true },
    detectMessageId: { type: String, required: true },
    postfix: { type: String, required: true },
    status: { type: String, required: true },
    entrance: {
        entranceChannelId: { type: String, required: true },
        quote: { type: String, required: true },
        messageId: { type: String, required: true },
        emoji: { type: String, required: true },
        role: { type: String, required: true },
    },
    isDeleted: { type: Boolean, required: true },
    broadcastInfo: {
        AfreecaId: { type: String, required: true },
        TwitchId: { type: String, required: true },
        ChzzkId: { type: String, required: true },
        YoutubeId: { type: String, required: true },
    },
    streamingStatus: {
        isTwitchStreamLive: { type: Boolean, required: true },
        isAfreecaStreamLive: { type: Boolean, required: true },
        isChzzkStreamLive: { type: Boolean, required: true },
        isYoutubeStreamLive: { type: Boolean, required: true },
    },
    serverDetectInfos: {
        broadcastDetect: {
            twitch: { type: Boolean, required: true },
            afreeca: { type: Boolean, required: true },
            chzzk: { type: Boolean, required: true },
            youtube: { type: Boolean, required: true },
        },
        newPostDetect: {
            afreeca: { type: Boolean, required: true },
            chzzk: { type: Boolean, required: true },
            youtube: { type: Boolean, required: true },
        },
        ownerChatDetect: {
            afreeca: { type: Boolean, required: true },
            chzzk: { type: Boolean, required: true },
            youtube: { type: Boolean, required: true },
        },
        elseDetect: {
            naverCafe: { type: Boolean, required: true },
        },
    },
    lastCommunityPostIDs: {
        afreeca: { type: String, required: true },
        chzzk: { type: String, required: true },
        youtube: { type: String, required: true },
    },
    settings: {
        isStreaming: { type: Boolean, required: true },
        isCommunityPost: { type: Boolean, required: true },
        isOwnerChat: { type: Boolean, required: true },
        isElse: { type: Boolean, required: true },
        isBroadcast: { type: Boolean, required: true },
    },
});

export default class MongoConnect {
    private static instance: MongoConnect;
    private serverModel: mongoose.Model<IServer>;
    constructor() {
        // Mongoose를 사용하여 MongoDB에 연결
        mongoose.connect(CONFIG.MONGO_URI as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions);
        this.serverModel = mongoose.model<IServer>(collectionName, ServerSchema);

    }
    public static getInstance(): MongoConnect {
        if (!MongoConnect.instance) {
            MongoConnect.instance = new MongoConnect();
        }
        return MongoConnect.instance;
    }
    
    public getModel() {
        return this.serverModel;
    }

    public async insertOne(data: ServerInfo) {
        const server = new this.serverModel(data);
        await server.save();
    }

    public async findOne(query: any) {
        return await this.serverModel.findOne(query);
    }
}
