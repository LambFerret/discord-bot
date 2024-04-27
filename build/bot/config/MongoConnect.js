"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Config_1 = require("./Config");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const uri = Config_1.CONFIG.MONGO_URI;
const databaseName = "myDatabase";
const collectionName = "servers";
const archiveCollectionName = "archive";
// 스키마 정의
const ServerSchema = new mongoose_1.Schema({
    name: { type: String, required: true, default: "" },
    id: { type: String, required: true, unique: true },
    createdDate: { type: Date, required: true, default: Date.now() },
    OwnerId: { type: String, required: true, default: "" },
    detectChannel: { type: String, required: false, default: "" },
    detectMessageId: { type: String, required: false, default: "" },
    postfix: { type: String, required: false, default: "삐삐리뽀" },
    status: { type: String, required: true, default: "INIT" },
    entrance: {
        entranceChannelId: { type: String, required: false, default: "" },
        quote: { type: String, required: false, default: "토끼 클릭으로 입장해요!" },
        messageId: { type: String, required: false, default: "" },
        emoji: { type: String, required: false, default: "🐰" },
        role: { type: String, required: false, default: "" },
    },
    isDeleted: { type: Boolean, required: true, default: false },
    broadcastInfo: {
        AfreecaId: { type: String, required: false, default: "" },
        TwitchId: { type: String, required: false, default: "" },
        ChzzkId: { type: String, required: false, default: "" },
        YoutubeId: { type: String, required: false, default: "" },
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
        twitchPostId: { type: [String], required: false, default: [] },
        afreecaPostId: { type: [String], required: false, default: [] },
        chzzkPostId: { type: [String], required: false, default: [] },
        youtubePostId: { type: [String], required: false, default: [] },
    },
    settings: {
        afreecaNewPostOnlyAnnouncement: { type: String, required: false, default: "" },
        newPostIncludeEveryone: { type: Boolean, required: true, default: false },
        liveIncludeEveryone: { type: Boolean, required: true, default: false },
        erasePreviousMessage: { type: Boolean, required: true, default: true },
    },
});
class MongoConnect {
    static instance;
    serverModel;
    constructor() {
        // Mongoose를 사용하여 MongoDB에 연결
        mongoose_1.default.connect(Config_1.CONFIG.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.serverModel = mongoose_1.default.model(collectionName, ServerSchema);
    }
    static getInstance() {
        if (!MongoConnect.instance) {
            MongoConnect.instance = new MongoConnect();
        }
        return MongoConnect.instance;
    }
    getModel() {
        return this.serverModel;
    }
    async insertOne(data) {
        try {
            const server = new this.serverModel(data);
            await server.save();
        }
        catch (e) {
            console.error(e.message);
        }
    }
    async findOne(query) {
        return await this.serverModel.findOne(query);
    }
}
exports.default = MongoConnect;
//# sourceMappingURL=MongoConnect.js.map