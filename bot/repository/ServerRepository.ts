import { Guild } from "discord.js";
import * as fss from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { DetectPlatform, DetectType } from "../model/DetectType";
import { Entrance, LiveInfoDTO, ServerInfo, Settings } from "../model/ServerType";

class ServerRepository {

    dbPath = (): string => {
        if (!fss.existsSync(__dirname + "/../../db/")) fss.mkdirSync(__dirname + "/../../db/");
        return path.join(__dirname + "/../../db/");
    }

    createNewServer = async (info: Guild) => {
        const entrance: Entrance = {
            entranceChannelId: "",
            quote: "토끼 클릭으로 입장해요!",
            messageId: "",
            emoji: "🐰",
            role: ""
        }
        const server: ServerInfo = {
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
        }
        await this.writeJsonAsFile(server);
        return server;
    }

    deleteServer = async (guildId: string) => {
        const info = await this.readJsonFromFile(guildId);
        info.isDeleted = true;
        await this.writeJsonAsFile(info);
        // and archive it
        await this.archiveServerFile(guildId);
    }

    getEntranceInfo = async (guildId: string) => {
        const info = await this.readJsonFromFile(guildId);
        return info.entrance;
    }

    getDetectInfo = async (guildId: string) => {
        const info = await this.readJsonFromFile(guildId);
        return info.serverDetectInfos;
    }

    getDetectID = async (guildId: string, platform: DetectPlatform) => {
        const info = await this.readJsonFromFile(guildId);
        switch (platform) {
            case DetectPlatform.Afreeca:
                return info.broadcastInfo.AfreecaId;
            case DetectPlatform.Chzzk:
                return info.broadcastInfo.ChzzkId;
            case DetectPlatform.Twitch:
                return info.broadcastInfo.TwitchId;
            case DetectPlatform.Youtube:
                return info.broadcastInfo.YoutubeId;
            default: return "";
        }
    }

    updateDetectID = async (guildId: string, platform: DetectPlatform, id: string) => {
        const info = await this.readJsonFromFile(guildId);
        switch (platform) {
            case DetectPlatform.Afreeca:
                info.broadcastInfo.AfreecaId = id;
                break;
            case DetectPlatform.Chzzk:
                info.broadcastInfo.ChzzkId = id;
                break;
            case DetectPlatform.Twitch:
                info.broadcastInfo.TwitchId = id;
                break;
            case DetectPlatform.Youtube:
                info.broadcastInfo.YoutubeId = id;
                break;
            default: return;
        }
        await this.writeJsonAsFile(info);
    }

    updateDetectInfo = async (guildId: string, channelId: string, type: DetectType, platform: DetectPlatform, setActive: boolean) => {
        const info = await this.readJsonFromFile(guildId);
        if (info.detectChannel === "") info.detectChannel = channelId;
        switch (type) {
            case DetectType.Broadcast:
                switch (platform) {
                    case DetectPlatform.Chzzk:
                        info.serverDetectInfos.broadcastDetect.chzzk = setActive;
                        break;
                    case DetectPlatform.Afreeca:
                        info.serverDetectInfos.broadcastDetect.afreeca = setActive;
                        break;
                    case DetectPlatform.Youtube:
                        info.serverDetectInfos.broadcastDetect.youtube = setActive;
                        break;
                    case DetectPlatform.Twitch:
                        info.serverDetectInfos.broadcastDetect.twitch = setActive;
                        break;
                    default: return;
                }
                break;
            case DetectType.NewPost:
                switch (platform) {
                    case DetectPlatform.Chzzk:
                        info.serverDetectInfos.newPostDetect.chzzk = setActive;
                        break;
                    case DetectPlatform.Afreeca:
                        info.serverDetectInfos.newPostDetect.afreeca = setActive;
                        break;
                    case DetectPlatform.Youtube:
                        info.serverDetectInfos.newPostDetect.youtube = setActive;
                        break;
                    default: return;
                }
                break;
            case DetectType.OwnerChat:
                switch (platform) {
                    case DetectPlatform.Chzzk:
                        info.serverDetectInfos.ownerChatDetect.chzzk = setActive;
                        break;
                    case DetectPlatform.Afreeca:
                        info.serverDetectInfos.ownerChatDetect.afreeca = setActive;
                        break;
                    case DetectPlatform.Youtube:
                        info.serverDetectInfos.ownerChatDetect.youtube = setActive;
                        break;
                    default: return;
                }
                break;
            case DetectType.Else:
                switch (platform) {
                    case DetectPlatform.NaverCafe:
                        info.serverDetectInfos.elseDetect.naverCafe = setActive;
                        break;
                    default: return;
                }
                break;
            default: return;
        }
        await this.writeJsonAsFile(info);

    }

    saveEntranceMessageId = async (guildId: string, messageId: string) => {
        const info = await this.readJsonFromFile(guildId);
        info.entrance.messageId = messageId;
        await this.writeJsonAsFile(info);
    }

    updateGuildEntranceQuote = async (guildId: string, quote: string) => {
        const info = await this.readJsonFromFile(guildId);
        info.entrance.quote = quote;
        await this.writeJsonAsFile(info);
    }

    updateGuildEntranceEmoji = async (guildId: string, emoji: string) => {
        const info = await this.readJsonFromFile(guildId);
        info.entrance.emoji = emoji;
        await this.writeJsonAsFile(info);
    }

    updateGuildEntranceRole = async (guildId: string, role: string) => {
        const info = await this.readJsonFromFile(guildId);
        info.entrance.role = role;
        await this.writeJsonAsFile(info);
    }

    checkStreamLive = async (guildId: string, type: DetectPlatform) => {
        const info = await this.readJsonFromFile(guildId);
        let liveDTO: LiveInfoDTO = {
            id: undefined,
            isLive: false,
        }
        switch (type) {
            case DetectPlatform.Afreeca:
                liveDTO.id = info.broadcastInfo.AfreecaId;
                liveDTO.isLive = info.streamingStatus.isAfreecaStreamLive;
                break;
            case DetectPlatform.Twitch:
                liveDTO.id = info.broadcastInfo.TwitchId;
                liveDTO.isLive = info.streamingStatus.isTwitchStreamLive;
                break;
            case DetectPlatform.Chzzk:
                liveDTO.id = info.broadcastInfo.ChzzkId;
                liveDTO.isLive = info.streamingStatus.isChzzkStreamLive;
                break;
            case DetectPlatform.Youtube:
                liveDTO.id = info.broadcastInfo.YoutubeId;
                liveDTO.isLive = info.streamingStatus.isYoutubeStreamLive;
                break;
        }
        return liveDTO;
    }

    updateStreamLive = async (guildId: string, type: DetectPlatform, isLive: boolean) => {
        const info = await this.readJsonFromFile(guildId);
        switch (type) {
            case DetectPlatform.Afreeca:
                info.streamingStatus.isAfreecaStreamLive = isLive;
                break;
            case DetectPlatform.Twitch:
                info.streamingStatus.isTwitchStreamLive = isLive;
                break;
            case DetectPlatform.Chzzk:
                info.streamingStatus.isChzzkStreamLive = isLive;
                break;
            case DetectPlatform.Youtube:
                info.streamingStatus.isYoutubeStreamLive = isLive;
                break;
            default: return;
        }
        await this.writeJsonAsFile(info);
    }

    getNewPostByPlatform = async (guildId: string, type: DetectPlatform): Promise<string[]> => {
        const info = await this.readJsonFromFile(guildId);
        switch (type) {
            case DetectPlatform.Afreeca:
                return info.lastCommunityPostIDs.afreecaPostId;
            case DetectPlatform.Chzzk:
                return info.lastCommunityPostIDs.chzzkPostId;
            case DetectPlatform.Youtube:
                return info.lastCommunityPostIDs.youtubePostId;
            default: return [];
        }
    }

    updateNewPostByPlatform = async (guildId: string, type: DetectPlatform, postId: string[]) => {
        if (postId.length > 30) postId = postId.slice(-30);
        const info = await this.readJsonFromFile(guildId);
        switch (type) {
            case DetectPlatform.Afreeca:
                info.lastCommunityPostIDs.afreecaPostId = postId;
                break;
            case DetectPlatform.Chzzk:
                info.lastCommunityPostIDs.chzzkPostId = postId;
                break;
            case DetectPlatform.Youtube:
                info.lastCommunityPostIDs.youtubePostId = postId;
                break;
            default: return;
        }
        await this.writeJsonAsFile(info);
    }

    getServerSettings = async (guildId: string): Promise<Settings> => {
        const info = await this.readJsonFromFile(guildId);
        return info.settings;
    }

    updateServerSettings = async (guildId: string, settings: Settings) => {
        const info = await this.readJsonFromFile(guildId);
        info.settings = settings;
        await this.writeJsonAsFile(info);
    }

    updateDetectChannel = async (guildId: string, channelId: string) => {
        const info = await this.readJsonFromFile(guildId);
        info.detectChannel = channelId;
        await this.writeJsonAsFile(info);
    }

    setEntranceChannel = async (guild: Guild, channelId: string) => {
        const info = await this.readJsonFromFile(guild.id);
        info.entrance.entranceChannelId = channelId;
        await this.writeJsonAsFile(info);
    }

    setNoticeChannel = async (guild: Guild, channelId: string) => {
        const info = await this.readJsonFromFile(guild.id);
        info.detectChannel = channelId;
        await this.writeJsonAsFile(info);
    }

    getDetectChannel = async (guildId: string): Promise<string> => (await this.readJsonFromFile(guildId)).detectChannel;
    getServerPostfix = async (guildId: string): Promise<string> => (await this.readJsonFromFile(guildId)).postfix;

    updateGuildPostfix = async (guildId: string, postfix: string) => {
        const info = await this.readJsonFromFile(guildId);
        info.postfix = postfix;
        await this.writeJsonAsFile(info);
    }

    writeJsonAsFile = async (info: ServerInfo) => {
        try {
            const filePath = path.join(this.dbPath(), `${info.id}.json`);
            await fs.writeFile(filePath, JSON.stringify(info, null, 2));
            console.log(`Server ${info.id} save successfully!`);
        } catch (err) {
            console.error(`Failed to create server: ${err}`);
        }
    }

    readJsonFromFile = async (id: string): Promise<ServerInfo> => {
        try {
            const filePath = path.join(this.dbPath(), `${id}.json`);
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data) as ServerInfo;
        } catch (err) {
            console.log(`Failed to read JSON from file: ${err}`);
            throw err;

        }
    }

    archiveServerFile = async (guildId: string) => {
        const time = new Date();
        const info = await this.readJsonFromFile(guildId);
        const archivePath = path.join(__dirname + "/../../archive/");
        if (!fss.existsSync(archivePath)) fss.mkdirSync(archivePath);
        const filePath = path.join(this.dbPath(), `${info.id}.json`);
        const archiveFilePath = path.join(archivePath, `${info.id}-${time.getFullYear()}-${time.getMonth()}-${time.getDate()}-${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}.json`);
        await fs.rename(filePath, archiveFilePath);
    }

    updateServerStreamer = (guildId: string) => {

    }

    getAllServers = async () => {
        const detectingServers: ServerInfo[] = [];
        for (const file of await fs.readdir(this.dbPath())) {
            const filePath = path.join(this.dbPath(), file);
            const data = await fs.readFile(filePath, 'utf-8');
            const info = JSON.parse(data) as ServerInfo;
            detectingServers.push(info);
        }

        return detectingServers;
    }

    getAllGuildId = async (): Promise<string[]> => {
        const guilds: string[] = [];
        for (const file of await fs.readdir(this.dbPath())) {
            const filePath = path.join(this.dbPath(), file);
            const data = await fs.readFile(filePath, 'utf-8');
            const info = JSON.parse(data) as ServerInfo;
            guilds.push(info.id);
        }
        return guilds;
    }

}


export default new ServerRepository();