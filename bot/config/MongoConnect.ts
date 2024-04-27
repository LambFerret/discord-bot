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
    name: { type: String, required: true, default: "" },
    id: { type: String, required: true, unique: true },
    createdDate: { type: Date, required: true, default: Date.now() },
    OwnerId: { type: String, required: true, default: "" },
    detectChannel: { type: String, required: true, default: "" },
    detectMessageId: { type: String, required: true, default: "" },
    postfix: { type: String, required: true, default: "삐삐리뽀" },
    status: { type: String, required: true, default: "INIT" },
    entrance: {
        entranceChannelId: { type: String, required: true, default: "" },
        quote: { type: String, required: true, default: "토끼 클릭으로 입장해요!" },
        messageId: { type: String, required: true, default: "" },
        emoji: { type: String, required: true, default: "🐰" },
        role: { type: String, required: true, default: "" },
    },
    isDeleted: { type: Boolean, required: true, default: false },
    broadcastInfo: {
        AfreecaId: { type: String, required: true, default: "" },
        TwitchId: { type: String, required: true, default: "" },
        ChzzkId: { type: String, required: true, default: "" },
        YoutubeId: { type: String, required: true, default: "" },
    },
    streamingStatus: {
        isTwitchStreamLive: { type: Boolean, required: true, default: false },
        isAfreecaStreamLive: { type: Boolean, required: true, default: false },
        isChzzkStreamLive: { type: Boolean, required: true, default: false },
        isYoutubeStreamLive: { type: Boolean, required: true, default: false },
    },
    serverDetectInfos: {
        broadcastDetect: {
            twitch: { type: Boolean, required: true, default: false },
            afreeca: { type: Boolean, required: true, default: false },
            chzzk: { type: Boolean, required: true, default: false },
            youtube: { type: Boolean, required: true, default: false },
        },
        newPostDetect: {
            afreeca: { type: Boolean, required: true, default: false },
            chzzk: { type: Boolean, required: true, default: false },
            youtube: { type: Boolean, required: true, default: false },
             
        },
        ownerChatDetect: {
            afreeca: { type: Boolean, required: true, default: false },
            chzzk: { type: Boolean, required: true, default: false },
            youtube: { type: Boolean, required: true, default: false },
        },
        elseDetect: {
            naverCafe: { type: Boolean, required: true, default: false },
        },
    },
    lastCommunityPostIDs: {
        twitchPostId: { type: [String], required: true, default: [] },
        afreecaPostId: { type: [String], required: true, default: [] },
        chzzkPostId: { type: [String], required: true, default: [] },
        youtubePostId: { type: [String], required: true, default: [] },
    },
    settings: {
        afreecaNewPostOnlyAnnouncement: { type: String, required: true, default: "" },
        newPostIncludeEveryone: { type: Boolean, required: true, default: false },
        liveIncludeEveryone: { type: Boolean, required: true, default: false },
        erasePreviousMessage: { type: Boolean, required: true, default: true },
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
