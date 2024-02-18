"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fss = tslib_1.__importStar(require("fs"));
const promises_1 = tslib_1.__importDefault(require("fs/promises"));
const path_1 = tslib_1.__importDefault(require("path"));
const DetectType_1 = require("../model/DetectType");
class ServerRepository {
    dbPath = () => {
        if (!fss.existsSync(__dirname + "/../../db/"))
            fss.mkdirSync(__dirname + "/../../db/");
        return path_1.default.join(__dirname + "/../../db/");
    };
    createNewServer = async (info) => {
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
            postfix: '삐삐리뽀',
            status: 'INIT',
            entrance: entrance,
            isDeleted: false,
            broadcastInfo: {
                AfreecaId: "",
                TwitchId: "",
                ChzzkId: "",
                YoutubeId: "",
            },
            streamingStatus: {
                isTwitchStreamLive: false,
                isAfreecaStreamLive: false,
                isChzzkStreamLive: false,
                isYoutubeStreamLive: false,
            },
            lastCommunityPostIDs: {
                twitchPostId: [],
                afreecaPostId: [],
                chzzkPostId: [],
                youtubePostId: [],
            },
            serverDetectInfos: {
                broadcastDetect: {
                    twitch: false,
                    afreeca: false,
                    chzzk: false,
                    youtube: false,
                },
                newPostDetect: {
                    afreeca: false,
                    chzzk: false,
                    youtube: false,
                },
                ownerChatDetect: {
                    afreeca: false,
                    chzzk: false,
                    youtube: false,
                },
                elseDetect: {
                    naverCafe: false,
                }
            },
            settings: {
                afreecaNewPostOnlyAnnouncement: "",
            }
        };
        await this.writeJsonAsFile(server);
        return server;
    };
    deleteServer = async (guildId) => {
        const info = await this.readJsonFromFile(guildId);
        info.isDeleted = true;
        await this.writeJsonAsFile(info);
        // and archive it
        await this.archiveServerFile(guildId);
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
        const info = await this.readJsonFromFile(guildId);
        switch (platform) {
            case DetectType_1.DetectPlatform.Afreeca:
                return info.broadcastInfo.AfreecaId;
            case DetectType_1.DetectPlatform.Chzzk:
                return info.broadcastInfo.ChzzkId;
            case DetectType_1.DetectPlatform.Twitch:
                return info.broadcastInfo.TwitchId;
            case DetectType_1.DetectPlatform.Youtube:
                return info.broadcastInfo.YoutubeId;
            default: return "";
        }
    };
    updateDetectID = async (guildId, platform, id) => {
        const info = await this.readJsonFromFile(guildId);
        switch (platform) {
            case DetectType_1.DetectPlatform.Afreeca:
                info.broadcastInfo.AfreecaId = id;
                break;
            case DetectType_1.DetectPlatform.Chzzk:
                info.broadcastInfo.ChzzkId = id;
                break;
            case DetectType_1.DetectPlatform.Twitch:
                info.broadcastInfo.TwitchId = id;
                break;
            case DetectType_1.DetectPlatform.Youtube:
                info.broadcastInfo.YoutubeId = id;
                break;
            default: return;
        }
        await this.writeJsonAsFile(info);
    };
    updateDetectInfo = async (guildId, channelId, type, platform, setActive) => {
        const info = await this.readJsonFromFile(guildId);
        if (info.detectChannel === "")
            info.detectChannel = channelId;
        switch (type) {
            case DetectType_1.DetectType.Broadcast:
                switch (platform) {
                    case DetectType_1.DetectPlatform.Chzzk:
                        info.serverDetectInfos.broadcastDetect.chzzk = setActive;
                        break;
                    case DetectType_1.DetectPlatform.Afreeca:
                        info.serverDetectInfos.broadcastDetect.afreeca = setActive;
                        break;
                    case DetectType_1.DetectPlatform.Youtube:
                        info.serverDetectInfos.broadcastDetect.youtube = setActive;
                        break;
                    case DetectType_1.DetectPlatform.Twitch:
                        info.serverDetectInfos.broadcastDetect.twitch = setActive;
                        break;
                    default: return;
                }
                break;
            case DetectType_1.DetectType.NewPost:
                switch (platform) {
                    case DetectType_1.DetectPlatform.Chzzk:
                        info.serverDetectInfos.newPostDetect.chzzk = setActive;
                        break;
                    case DetectType_1.DetectPlatform.Afreeca:
                        info.serverDetectInfos.newPostDetect.afreeca = setActive;
                        break;
                    case DetectType_1.DetectPlatform.Youtube:
                        info.serverDetectInfos.newPostDetect.youtube = setActive;
                        break;
                    default: return;
                }
                break;
            case DetectType_1.DetectType.OwnerChat:
                switch (platform) {
                    case DetectType_1.DetectPlatform.Chzzk:
                        info.serverDetectInfos.ownerChatDetect.chzzk = setActive;
                        break;
                    case DetectType_1.DetectPlatform.Afreeca:
                        info.serverDetectInfos.ownerChatDetect.afreeca = setActive;
                        break;
                    case DetectType_1.DetectPlatform.Youtube:
                        info.serverDetectInfos.ownerChatDetect.youtube = setActive;
                        break;
                    default: return;
                }
                break;
            case DetectType_1.DetectType.Else:
                switch (platform) {
                    case DetectType_1.DetectPlatform.NaverCafe:
                        info.serverDetectInfos.elseDetect.naverCafe = setActive;
                        break;
                    default: return;
                }
                break;
            default: return;
        }
        await this.writeJsonAsFile(info);
    };
    saveEntranceMessageId = async (guildId, messageId) => {
        const info = await this.readJsonFromFile(guildId);
        info.entrance.messageId = messageId;
        await this.writeJsonAsFile(info);
    };
    updateGuildEntranceQuote = async (guildId, quote) => {
        const info = await this.readJsonFromFile(guildId);
        info.entrance.quote = quote;
        await this.writeJsonAsFile(info);
    };
    updateGuildEntranceEmoji = async (guildId, emoji) => {
        const info = await this.readJsonFromFile(guildId);
        info.entrance.emoji = emoji;
        await this.writeJsonAsFile(info);
    };
    updateGuildEntranceRole = async (guildId, role) => {
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
            case DetectType_1.DetectPlatform.Youtube:
                liveDTO.id = info.broadcastInfo.YoutubeId;
                liveDTO.isLive = info.streamingStatus.isYoutubeStreamLive;
                break;
        }
        return liveDTO;
    };
    updateStreamLive = async (guildId, type, isLive) => {
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
            case DetectType_1.DetectPlatform.Youtube:
                info.streamingStatus.isYoutubeStreamLive = isLive;
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
            case DetectType_1.DetectPlatform.Youtube:
                return info.lastCommunityPostIDs.youtubePostId;
            default: return [];
        }
    };
    updateNewPostByPlatform = async (guildId, type, postId) => {
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
            case DetectType_1.DetectPlatform.Youtube:
                info.lastCommunityPostIDs.youtubePostId = postId;
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
        const info = await this.readJsonFromFile(guildId);
        info.settings = settings;
        await this.writeJsonAsFile(info);
    };
    updateDetectChannel = async (guildId, channelId) => {
        const info = await this.readJsonFromFile(guildId);
        info.detectChannel = channelId;
        await this.writeJsonAsFile(info);
    };
    setEntranceChannel = async (guild, channelId) => {
        const info = await this.readJsonFromFile(guild.id);
        info.entrance.entranceChannelId = channelId;
        await this.writeJsonAsFile(info);
    };
    setNoticeChannel = async (guild, channelId) => {
        const info = await this.readJsonFromFile(guild.id);
        info.detectChannel = channelId;
        await this.writeJsonAsFile(info);
    };
    getDetectChannel = async (guildId) => (await this.readJsonFromFile(guildId)).detectChannel;
    getServerPostfix = async (guildId) => (await this.readJsonFromFile(guildId)).postfix;
    updateGuildPostfix = async (guildId, postfix) => {
        const info = await this.readJsonFromFile(guildId);
        info.postfix = postfix;
        await this.writeJsonAsFile(info);
    };
    writeJsonAsFile = async (info) => {
        try {
            const filePath = path_1.default.join(this.dbPath(), `${info.id}.json`);
            await promises_1.default.writeFile(filePath, JSON.stringify(info, null, 2));
            console.log(`Server ${info.id} save successfully!`);
        }
        catch (err) {
            console.error(`Failed to create server: ${err}`);
        }
    };
    readJsonFromFile = async (id) => {
        try {
            const filePath = path_1.default.join(this.dbPath(), `${id}.json`);
            const data = await promises_1.default.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (err) {
            console.log(`Failed to read JSON from file: ${err}`);
            throw err;
        }
    };
    archiveServerFile = async (guildId) => {
        const time = new Date();
        const info = await this.readJsonFromFile(guildId);
        const archivePath = path_1.default.join(__dirname + "/../../archive/");
        if (!fss.existsSync(archivePath))
            fss.mkdirSync(archivePath);
        const filePath = path_1.default.join(this.dbPath(), `${info.id}.json`);
        const archiveFilePath = path_1.default.join(archivePath, `${info.id}-${time.getFullYear()}-${time.getMonth()}-${time.getDate()}-${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}.json`);
        await promises_1.default.rename(filePath, archiveFilePath);
    };
    updateServerStreamer = (guildId) => {
    };
    getAllServers = async () => {
        const detectingServers = [];
        for (const file of await promises_1.default.readdir(this.dbPath())) {
            const filePath = path_1.default.join(this.dbPath(), file);
            const data = await promises_1.default.readFile(filePath, 'utf-8');
            const info = JSON.parse(data);
            detectingServers.push(info);
        }
        return detectingServers;
    };
    getAllGuildId = async () => {
        const guilds = [];
        for (const file of await promises_1.default.readdir(this.dbPath())) {
            const filePath = path_1.default.join(this.dbPath(), file);
            const data = await promises_1.default.readFile(filePath, 'utf-8');
            const info = JSON.parse(data);
            guilds.push(info.id);
        }
        return guilds;
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