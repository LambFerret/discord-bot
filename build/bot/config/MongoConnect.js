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
        const server = new this.serverModel(data);
        await server.save();
    }
    async findOne(query) {
        return await this.serverModel.findOne(query);
    }
}
exports.default = MongoConnect;
//# sourceMappingURL=MongoConnect.js.map