"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fss = tslib_1.__importStar(require("fs"));
const promises_1 = tslib_1.__importDefault(require("fs/promises"));
const path_1 = tslib_1.__importDefault(require("path"));
const DetectType_1 = require("../model/DetectType");
const MongoConnect_1 = tslib_1.__importDefault(require("../config/MongoConnect"));
class ServerRepository {
    db;
    constructor() {
        this.db = MongoConnect_1.default.getInstance();
    }
    dbPath = () => {
        if (!fss.existsSync(__dirname + "/../../db/"))
            fss.mkdirSync(__dirname + "/../../db/");
        return path_1.default.join(__dirname + "/../../db/");
    };
    log = (methodName, content) => {
        const totalLength = 30;
        const nameLength = methodName.length;
        const totalPadding = totalLength - nameLength;
        const leftPadding = Math.floor(totalPadding / 2);
        const rightPadding = totalPadding - leftPadding;
        const paddedName = ' '.repeat(leftPadding) + methodName + ' '.repeat(rightPadding);
        console.log(`${new Date().toISOString()} | [${paddedName}] - ${content}`);
    };
    createNewServer = async (info) => {
        this.log(`Create New Server`, `${info.name} : ${info.id}`);
        const entrance = {
            entranceChannelId: "",
            quote: "토끼 클릭으로 입장해요!",
            messageId: "",
            emoji: "🐰",
            role: ""
        };
        const server = {
            name: info.name,
            id: info.id,
            createdDate: info.joinedAt,
            OwnerId: info.ownerId,
            detectChannel: "",
            detectMessageId: "",
            postfix: '삐삐리뽀',
            status: 'INIT',
            entrance: entrance,
            isDeleted: false,
            broadcastInfo: {
                AfreecaId: "",
                TwitchId: "",
                ChzzkId: "",
            },
            streamingStatus: {
                isTwitchStreamLive: false,
                isAfreecaStreamLive: false,
                isChzzkStreamLive: false,
            },
            lastCommunityPostIDs: {
                twitchPostId: [],
                afreecaPostId: [],
                chzzkPostId: [],
            },
            serverDetectInfos: {
                broadcastDetect: {
                    twitch: false,
                    afreeca: false,
                    chzzk: false,
                },
                newPostDetect: {
                    afreeca: false,
                    chzzk: false,
                },
                ownerChatDetect: {
                    afreeca: false,
                    chzzk: false,
                },
                elseDetect: {
                    naverCafe: false,
                }
            },
            settings: {
                afreecaNewPostOnlyAnnouncement: "",
                newPostIncludeEveryone: false,
                liveIncludeEveryone: false,
                erasePreviousMessage: true,
            }
        };
        this.db.insertOne(server);
        return server;
    };
    deleteServerWithDB = async (guildId) => {
        this.log(`Delete Server`, `${guildId}`);
        const data = await this.db.findOne({ id: guildId });
        await this.SaveDataInfoFile(guildId, data);
        await this.db.deleteOne({ id: guildId });
    };
    getEntranceInfo = async (guildId) => {
        const info = await this.readJsonFromFile(guildId);
        return info.entrance;
    };
    getDetectInfo = async (guildId) => {
        const info = await this.readJsonFromFile(guildId);
        return info.serverDetectInfos;
    };
    getDetectID = async (guildId, platform) => {
        const info = await this.db.findOne({ id: guildId });
        if (!info || !info.broadcastInfo)
            return "";
        switch (platform) {
            case DetectType_1.DetectPlatform.Afreeca:
                return info.broadcastInfo.AfreecaId;
            case DetectType_1.DetectPlatform.Chzzk:
                return info.broadcastInfo.ChzzkId;
            case DetectType_1.DetectPlatform.Twitch:
                return info.broadcastInfo.TwitchId;
            default: return "";
        }
    };
    updateDetectID = async (guildId, platform, id) => {
        this.log(`Update Detect ID`, `${guildId} : ${platform} : ${id}`);
        switch (platform) {
            case DetectType_1.DetectPlatform.Afreeca:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "broadcastInfo.AfreecaId": id } });
                break;
            case DetectType_1.DetectPlatform.Chzzk:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "broadcastInfo.ChzzkId": id } });
                break;
            case DetectType_1.DetectPlatform.Twitch:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "broadcastInfo.TwitchId": id } });
                break;
            default: return;
        }
    };
    updateDetectInfo = async (guildId, channelId, type, platform, setActive) => {
        this.log(`Update Detect Info`, `${guildId} : ${channelId} : ${type} : ${platform} : ${setActive}`);
        const info = await this.readJsonFromFile(guildId);
        if (info.detectChannel === "")
            this.db.findOneAndUpdate({ id: guildId }, { $set: { detectChannel: channelId } });
        switch (type) {
            case DetectType_1.DetectType.Broadcast:
                switch (platform) {
                    case DetectType_1.DetectPlatform.Chzzk:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.broadcastDetect.chzzk": setActive } });
                        break;
                    case DetectType_1.DetectPlatform.Afreeca:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.broadcastDetect.afreeca": setActive } });
                        break;
                    case DetectType_1.DetectPlatform.Twitch:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.broadcastDetect.twitch": setActive } });
                        break;
                    default: return;
                }
                break;
            case DetectType_1.DetectType.NewPost:
                switch (platform) {
                    case DetectType_1.DetectPlatform.Chzzk:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.broadcastDetect.chzzk": setActive } });
                        break;
                    case DetectType_1.DetectPlatform.Afreeca:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.broadcastDetect.afreeca": setActive } });
                        break;
                    default: return;
                }
                break;
            case DetectType_1.DetectType.OwnerChat:
                switch (platform) {
                    case DetectType_1.DetectPlatform.Chzzk:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.broadcastDetect.chzzk": setActive } });
                        break;
                    case DetectType_1.DetectPlatform.Afreeca:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.broadcastDetect.afreeca": setActive } });
                        break;
                    default: return;
                }
                break;
            case DetectType_1.DetectType.Else:
                switch (platform) {
                    case DetectType_1.DetectPlatform.NaverCafe:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.broadcastDetect.naverCafe": setActive } });
                        break;
                    default: return;
                }
                break;
            default: return;
        }
    };
    saveEntranceMessageId = async (guildId, messageId) => {
        this.log(`Save Entrance Message ID`, `${guildId} : ${messageId}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "entrance.messageId": messageId } });
    };
    updateGuildEntranceQuote = async (guildId, quote) => {
        this.log(`Update Entrance Quote`, `${guildId} : ${quote}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "entrance.quote": quote } });
    };
    updateGuildEntranceEmoji = async (guildId, emoji) => {
        this.log(`Update Entrance Emoji`, `${guildId} : ${emoji}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "entrance.emoji": emoji } });
    };
    updateGuildEntranceRole = async (guildId, role) => {
        this.log(`Update Entrance Role`, `${guildId} : ${role}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "entrance.role": role } });
    };
    checkStreamLive = async (guildId, type) => {
        let liveDTO = {
            id: undefined,
            isLive: false,
        };
        const info = await this.db.findOne({ id: guildId });
        if (!info)
            return liveDTO;
        switch (type) {
            case DetectType_1.DetectPlatform.Afreeca:
                liveDTO.id = info.broadcastInfo.AfreecaId;
                liveDTO.isLive = info.streamingStatus.isAfreecaStreamLive;
                break;
            case DetectType_1.DetectPlatform.Twitch:
                liveDTO.id = info.broadcastInfo.TwitchId;
                liveDTO.isLive = info.streamingStatus.isTwitchStreamLive;
                break;
            case DetectType_1.DetectPlatform.Chzzk:
                liveDTO.id = info.broadcastInfo.ChzzkId;
                liveDTO.isLive = info.streamingStatus.isChzzkStreamLive;
                break;
        }
        return liveDTO;
    };
    updateStreamLive = async (guildId, type, isLive) => {
        this.log(`Update Stream Live`, `${guildId} : ${type} : ${isLive}`);
        switch (type) {
            case DetectType_1.DetectPlatform.Afreeca:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "streamingStatus.isAfreecaStreamLive": isLive } });
                break;
            case DetectType_1.DetectPlatform.Twitch:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "streamingStatus.isTwitchStreamLive": isLive } });
                break;
            case DetectType_1.DetectPlatform.Chzzk:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "streamingStatus.isChzzkStreamLive": isLive } });
                break;
            default: return;
        }
    };
    getNewPostByPlatform = async (guildId, type) => {
        const info = await this.db.findOne({ id: guildId });
        if (!info)
            return [];
        switch (type) {
            case DetectType_1.DetectPlatform.Afreeca:
                return info.lastCommunityPostIDs.afreecaPostId;
            case DetectType_1.DetectPlatform.Chzzk:
                return info.lastCommunityPostIDs.chzzkPostId;
            default: return [];
        }
    };
    updateNewPostByPlatform = async (guildId, type, postId) => {
        this.log(`Update New Post`, `${guildId} : ${type} : ${postId}`);
        if (postId.length > 30)
            postId = postId.slice(-30);
        switch (type) {
            case DetectType_1.DetectPlatform.Afreeca:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "lastCommunityPostIDs.afreecaPostId": postId } });
                break;
            case DetectType_1.DetectPlatform.Chzzk:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "lastCommunityPostIDs.chzzkPostId": postId } });
                break;
            default: return;
        }
    };
    getServerSettings = async (guildId) => {
        const info = await this.db.findOne({ id: guildId });
        return info.settings;
    };
    updateServerSettings = async (guildId, settings) => {
        this.log(`Update Server Settings`, `${guildId} : ${settings}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { settings: settings } });
    };
    updateDetectChannel = async (guildId, channelId) => {
        this.log(`Update Detect Channel`, `${guildId} : ${channelId}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { detectChannel: channelId } });
    };
    setEntranceChannel = async (guild, channelId) => {
        this.log(`Set Entrance Channel`, `${guild.name} : ${channelId}`);
        await this.db.findOneAndUpdate({ id: guild.id }, { $set: { "entrance.entranceChannelId": channelId } });
    };
    setNoticeChannel = async (guild, channelId) => {
        this.log(`Set Notice Channel`, `${guild.name} : ${channelId}`);
        await this.db.findOneAndUpdate({ id: guild.id }, { $set: { detectChannel: channelId } });
    };
    getDetectChannel = async (guildId) => (await this.db.findOne({ id: guildId })).detectChannel;
    getServerPostfix = async (guildId) => (await this.db.findOne({ id: guildId })).postfix;
    updateGuildPostfix = async (guildId, postfix) => {
        this.log(`Update Postfix`, `${guildId} : ${postfix}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { postfix: postfix } });
    };
    getServerMessageId = async (guildId) => (await this.db.findOne({ id: guildId })).detectMessageId;
    setServerMessageId = async (guildId, messageId) => {
        this.log(`Set Server Message ID`, `${guildId} : ${messageId}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { detectMessageId: messageId } });
    };
    /*
        readJsonFromFile = async (id: string): Promise<ServerInfo> => {
            console.log(`Read JSON from file: ${id}`);
            
            const filePath = path.join(this.dbPath(), `${id}.json`);
            try {
                const data = await fs.readFile(filePath, 'utf-8');
                return JSON.parse(data) as ServerInfo;
            } catch (err) {
                if (err instanceof Error && !err.toString().includes('ENOENT')) {
                    console.log(`Failed to read JSON from file: ${err}`);
                }
                if (err instanceof SyntaxError) {
                    // reset the file
                    console.log(`plz abort`);
                }
                throw err;
            }
        }
        */
    readJsonFromFile = async (id) => {
        try {
            const data = await this.db.findOne({ id: id });
            return data;
        }
        catch (err) {
            console.error(`Failed to read JSON from file: ${err}`);
            throw err;
        }
    };
    SaveDataInfoFile = async (guildId, data) => {
        const time = new Date();
        const filePath = path_1.default.join(__dirname + "/../../archive/");
        if (!fss.existsSync(filePath))
            fss.mkdirSync(filePath);
        const archiveFilePath = path_1.default.join(filePath, `${guildId}-${time.getFullYear()}-${time.getMonth()}-${time.getDate()}-${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}.json`);
        try {
            await promises_1.default.writeFile(archiveFilePath, JSON.stringify(data, null, 2));
        }
        catch (err) {
            console.error(`Failed Save File : ${err}`);
        }
    };
    updateServerStreamer = (guildId) => {
    };
    getAllServers = async () => {
        const detectingServers = [];
        for (const file of await promises_1.default.readdir(this.dbPath())) {
            let info;
            try {
                info = await this.readJsonFromFile(file.replace('.json', ''));
            }
            catch (err) {
                console.error(`Abort Application`);
                process.exit(1);
            }
            if (info)
                detectingServers.push(info);
        }
        return detectingServers;
    };
    checkGuildExists = async (guildId) => {
        try {
            const filePath = path_1.default.join(this.dbPath(), `${guildId}.json`);
            await promises_1.default.access(filePath);
            return true;
        }
        catch (err) {
            return false;
        }
    };
}
exports.default = new ServerRepository();
//# sourceMappingURL=ServerRepository.js.map