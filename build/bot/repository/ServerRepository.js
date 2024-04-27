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
        const info = await this.readJsonFromDB(guildId);
        return info.entrance;
    };
    getDetectInfo = async (guildId) => {
        const info = await this.readJsonFromDB(guildId);
        return info.serverDetectInfos;
    };
    getDetectID = async (guildId, platform) => {
        const info = await this.readJsonFromDB(guildId);
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
                this.db.findOneAndUpdate({ id: guildId }, { $set: { broadcastInfo: { AfreecaId: id } } });
                break;
            case DetectType_1.DetectPlatform.Chzzk:
                this.db.findOneAndUpdate({ id: guildId }, { $set: { broadcastInfo: { ChzzkId: id } } });
                break;
            case DetectType_1.DetectPlatform.Twitch:
                this.db.findOneAndUpdate({ id: guildId }, { $set: { broadcastInfo: { TwitchId: id } } });
                break;
            default: return;
        }
    };
    updateDetectInfo = async (guildId, channelId, type, platform, setActive) => {
        this.log(`Update Detect Info`, `${guildId} : ${channelId} : ${type} : ${platform} : ${setActive}`);
        const info = await this.readJsonFromDB(guildId);
        if (info.detectChannel === "")
            this.db.findOneAndUpdate({ id: guildId }, { $set: { detectChannel: channelId } });
        switch (type) {
            case DetectType_1.DetectType.Broadcast:
                switch (platform) {
                    case DetectType_1.DetectPlatform.Chzzk:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { broadcastDetect: { chzzk: setActive } } } });
                        break;
                    case DetectType_1.DetectPlatform.Afreeca:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { broadcastDetect: { afreeca: setActive } } } });
                        break;
                    case DetectType_1.DetectPlatform.Twitch:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { broadcastDetect: { twitch: setActive } } } });
                        break;
                    default: return;
                }
                break;
            case DetectType_1.DetectType.NewPost:
                switch (platform) {
                    case DetectType_1.DetectPlatform.Chzzk:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { newPostDetect: { chzzk: setActive } } } });
                        break;
                    case DetectType_1.DetectPlatform.Afreeca:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { newPostDetect: { afreeca: setActive } } } });
                        break;
                    default: return;
                }
                break;
            case DetectType_1.DetectType.OwnerChat:
                switch (platform) {
                    case DetectType_1.DetectPlatform.Chzzk:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { ownerChatDetect: { chzzk: setActive } } } });
                        break;
                    case DetectType_1.DetectPlatform.Afreeca:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { ownerChatDetect: { afreeca: setActive } } } });
                        break;
                    default: return;
                }
                break;
            case DetectType_1.DetectType.Else:
                switch (platform) {
                    case DetectType_1.DetectPlatform.NaverCafe:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { elseDetect: { naverCafe: setActive } } } });
                        break;
                    default: return;
                }
                break;
            default: return;
        }
    };
    saveEntranceMessageId = async (guildId, messageId) => {
        this.log(`Save Entrance Message ID`, `${guildId} : ${messageId}`);
        const info = await this.readJsonFromFile(guildId);
        info.entrance.messageId = messageId;
        await this.writeJsonAsFile(info);
    };
    updateGuildEntranceQuote = async (guildId, quote) => {
        this.log(`Update Entrance Quote`, `${guildId} : ${quote}`);
        const info = await this.readJsonFromFile(guildId);
        info.entrance.quote = quote;
        await this.writeJsonAsFile(info);
    };
    updateGuildEntranceEmoji = async (guildId, emoji) => {
        this.log(`Update Entrance Emoji`, `${guildId} : ${emoji}`);
        const info = await this.readJsonFromFile(guildId);
        info.entrance.emoji = emoji;
        await this.writeJsonAsFile(info);
    };
    updateGuildEntranceRole = async (guildId, role) => {
        this.log(`Update Entrance Role`, `${guildId} : ${role}`);
        const info = await this.readJsonFromFile(guildId);
        info.entrance.role = role;
        await this.writeJsonAsFile(info);
    };
    checkStreamLive = async (guildId, type) => {
        const info = await this.readJsonFromFile(guildId);
        let liveDTO = {
            id: undefined,
            isLive: false,
        };
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
        const info = await this.readJsonFromFile(guildId);
        switch (type) {
            case DetectType_1.DetectPlatform.Afreeca:
                info.streamingStatus.isAfreecaStreamLive = isLive;
                break;
            case DetectType_1.DetectPlatform.Twitch:
                info.streamingStatus.isTwitchStreamLive = isLive;
                break;
            case DetectType_1.DetectPlatform.Chzzk:
                info.streamingStatus.isChzzkStreamLive = isLive;
                break;
            default: return;
        }
        await this.writeJsonAsFile(info);
    };
    getNewPostByPlatform = async (guildId, type) => {
        const info = await this.readJsonFromFile(guildId);
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
        const info = await this.readJsonFromFile(guildId);
        switch (type) {
            case DetectType_1.DetectPlatform.Afreeca:
                info.lastCommunityPostIDs.afreecaPostId = postId;
                break;
            case DetectType_1.DetectPlatform.Chzzk:
                info.lastCommunityPostIDs.chzzkPostId = postId;
                break;
            default: return;
        }
        await this.writeJsonAsFile(info);
    };
    getServerSettings = async (guildId) => {
        const info = await this.readJsonFromFile(guildId);
        return info.settings;
    };
    updateServerSettings = async (guildId, settings) => {
        this.log(`Update Server Settings`, `${guildId} : ${settings}`);
        const info = await this.readJsonFromFile(guildId);
        info.settings = settings;
        await this.writeJsonAsFile(info);
    };
    updateDetectChannel = async (guildId, channelId) => {
        this.log(`Update Detect Channel`, `${guildId} : ${channelId}`);
        const info = await this.readJsonFromFile(guildId);
        info.detectChannel = channelId;
        await this.writeJsonAsFile(info);
    };
    setEntranceChannel = async (guild, channelId) => {
        this.log(`Set Entrance Channel`, `${guild.name} : ${channelId}`);
        const info = await this.readJsonFromFile(guild.id);
        info.entrance.entranceChannelId = channelId;
        await this.writeJsonAsFile(info);
    };
    setNoticeChannel = async (guild, channelId) => {
        this.log(`Set Notice Channel`, `${guild.name} : ${channelId}`);
        const info = await this.readJsonFromFile(guild.id);
        info.detectChannel = channelId;
        await this.writeJsonAsFile(info);
    };
    getDetectChannel = async (guildId) => (await this.readJsonFromFile(guildId)).detectChannel;
    getServerPostfix = async (guildId) => (await this.readJsonFromFile(guildId)).postfix;
    updateGuildPostfix = async (guildId, postfix) => {
        this.log(`Update Postfix`, `${guildId} : ${postfix}`);
        const info = await this.readJsonFromFile(guildId);
        info.postfix = postfix;
        await this.writeJsonAsFile(info);
    };
    getServerMessageId = async (guildId) => (await this.readJsonFromFile(guildId)).detectMessageId;
    setServerMessageId = async (guildId, messageId) => {
        this.log(`Set Server Message ID`, `${guildId} : ${messageId}`);
        const info = await this.readJsonFromFile(guildId);
        info.detectMessageId = messageId;
        await this.writeJsonAsFile(info);
    };
    writeJsonAsFile = async (info) => {
        try {
            // const filePath = path.join(this.dbPath(), `${info.id}.json`);
            // await fs.writeFile(filePath, JSON.stringify(info, null, 2));
            console.log(`I Just Pretend to .. : Server ${info.id} save successfully!`);
        }
        catch (err) {
            console.error(`Failed to create server: ${err}`);
        }
    };
    readRawJsonFromFile = async (fileName) => {
        const filePath = path_1.default.join(this.dbPath(), fileName);
        try {
            const data = await promises_1.default.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (err) {
            if (err instanceof Error && !err.toString().includes('ENOENT')) {
                console.log(`Failed to read JSON from file: ${err}`);
            }
            if (err instanceof SyntaxError) {
                // reset the file
                console.log(`plz abort`);
            }
            throw err;
        }
    };
    readJsonFromFile = async (id) => {
        console.log(`Read JSON from file: ${id}`);
        const filePath = path_1.default.join(this.dbPath(), `${id}.json`);
        try {
            const data = await promises_1.default.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (err) {
            if (err instanceof Error && !err.toString().includes('ENOENT')) {
                console.log(`Failed to read JSON from file: ${err}`);
            }
            if (err instanceof SyntaxError) {
                // reset the file
                console.log(`plz abort`);
            }
            throw err;
        }
    };
    readJsonFromDB = async (id) => {
        try {
            return await this.db.findOne({ id: id });
        }
        catch (err) {
            console.error(`Failed to read JSON from file: ${err}`);
            throw err;
        }
    };
    transferJsonToDB = async () => {
        // find all json file and insert to db
        for (const file of await promises_1.default.readdir(this.dbPath())) {
            let info;
            try {
                info = await this.readRawJsonFromFile(file);
            }
            catch (err) {
                continue;
            }
            if (info) {
                await this.db.insertOne(info);
            }
        }
    };
    archiveServerFile = async (guildId) => {
        const time = new Date();
        const archivePath = path_1.default.join(__dirname + "/../../archive/");
        if (!fss.existsSync(archivePath))
            fss.mkdirSync(archivePath);
        const filePath = path_1.default.join(this.dbPath(), `${guildId}.json`);
        const archiveFilePath = path_1.default.join(archivePath, `${guildId}-${time.getFullYear()}-${time.getMonth()}-${time.getDate()}-${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}.json`);
        await promises_1.default.rename(filePath, archiveFilePath);
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