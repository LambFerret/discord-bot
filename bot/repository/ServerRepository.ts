import { Guild } from "discord.js";
import * as fss from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { DetectPlatform, DetectType } from "../model/DetectType";
import { Entrance, LiveInfoDTO, ServerInfo, Settings } from "../model/ServerType";
import MongoConnect from "../config/MongoConnect";
import { Collection } from "mongodb";

class ServerRepository {
    private db: MongoConnect;

    constructor() {
        this.db = MongoConnect.getInstance();
    }

    dbPath = (): string => {
        if (!fss.existsSync(__dirname + "/../../db/")) fss.mkdirSync(__dirname + "/../../db/");
        return path.join(__dirname + "/../../db/");
    }
    log = (methodName: string, content: string) => {
        const totalLength = 30;
        const nameLength = methodName.length;
        const totalPadding = totalLength - nameLength;
        const leftPadding = Math.floor(totalPadding / 2);
        const rightPadding = totalPadding - leftPadding;
        const paddedName = ' '.repeat(leftPadding) + methodName + ' '.repeat(rightPadding);
        console.log(`${new Date().toISOString()} | [${paddedName}] - ${content}`);
    }

    createNewServer = async (info: Guild): Promise<ServerInfo> => {
        this.log(`Create New Server`, `${info.name} : ${info.id}`);

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
        }
        this.db.insertOne(server);
        return server;
    }

    deleteServerWithDB = async (guildId: string) => {
        this.log(`Delete Server`, `${guildId}`);
        const data = await this.db.findOne({ id: guildId });
        await this.SaveDataInfoFile(guildId, data);
        await this.db.deleteOne({ id: guildId });
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
        const info = await this.db.findOne({ id: guildId });
        if (!info || !info.broadcastInfo) return "";
        switch (platform) {
            case DetectPlatform.Afreeca:
                return info.broadcastInfo.AfreecaId;
            case DetectPlatform.Chzzk:
                return info.broadcastInfo.ChzzkId;
            case DetectPlatform.Twitch:
                return info.broadcastInfo.TwitchId;
            default: return "";
        }
    }

    updateDetectID = async (guildId: string, platform: DetectPlatform, id: string) => {
        this.log(`Update Detect ID`, `${guildId} : ${platform} : ${id}`);
        switch (platform) {
            case DetectPlatform.Afreeca:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "broadcastInfo.AfreecaId": id } });
                break;
            case DetectPlatform.Chzzk:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "broadcastInfo.ChzzkId": id } });
                break;
            case DetectPlatform.Twitch:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "broadcastInfo.TwitchId": id } });
                break;
            default: return;
        }
    }

    updateDetectInfo = async (guildId: string, channelId: string, type: DetectType, platform: DetectPlatform, setActive: boolean) => {
        this.log(`Update Detect Info`, `${guildId} : ${channelId} : ${type} : ${platform} : ${setActive}`);
        const info = await this.readJsonFromFile(guildId);
        if (info.detectChannel === "") this.db.findOneAndUpdate({ id: guildId }, { $set: { detectChannel: channelId } });
        switch (type) {
            case DetectType.Broadcast:
                switch (platform) {
                    case DetectPlatform.Chzzk:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.broadcastDetect.chzzk": setActive } });
                        break;
                    case DetectPlatform.Afreeca:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.broadcastDetect.afreeca": setActive } });
                        break;
                    case DetectPlatform.Twitch:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.broadcastDetect.twitch": setActive } });
                        break;
                    default: return;
                }
                break;
            case DetectType.NewPost:
                switch (platform) {
                    case DetectPlatform.Chzzk:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.newPostDetect.chzzk": setActive } });
                        break;
                    case DetectPlatform.Afreeca:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.newPostDetect.afreeca": setActive } });
                        break;
                    default: return;
                }
                break;
            case DetectType.OwnerChat:
                switch (platform) {
                    case DetectPlatform.Chzzk:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.ownerChatDetect.chzzk": setActive } });
                        break;
                    case DetectPlatform.Afreeca:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.ownerChatDetect.afreeca": setActive } });
                        break;
                    default: return;
                }
                break;
            case DetectType.Else:
                switch (platform) {
                    case DetectPlatform.NaverCafe:
                        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "serverDetectInfos.elseDetect.naverCafe": setActive } });
                        break;
                    default: return;
                }
                break;
            default: return;
        }
    }

    saveEntranceMessageId = async (guildId: string, messageId: string) => {
        this.log(`Save Entrance Message ID`, `${guildId} : ${messageId}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "entrance.messageId": messageId } });
    }

    updateGuildEntranceQuote = async (guildId: string, quote: string) => {
        this.log(`Update Entrance Quote`, `${guildId} : ${quote}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "entrance.quote": quote } });
    }

    updateGuildEntranceEmoji = async (guildId: string, emoji: string) => {
        this.log(`Update Entrance Emoji`, `${guildId} : ${emoji}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "entrance.emoji": emoji } });
    }

    updateGuildEntranceRole = async (guildId: string, role: string) => {
        this.log(`Update Entrance Role`, `${guildId} : ${role}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { "entrance.role": role } });
    }

    checkStreamLive = async (guildId: string, type: DetectPlatform) => {
        let liveDTO: LiveInfoDTO = {
            id: undefined,
            isLive: false,
        }
        const info = await this.db.findOne({ id: guildId });
        if (!info) return liveDTO;
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
        }
        return liveDTO;
    }

    updateStreamLive = async (guildId: string, type: DetectPlatform, isLive: boolean) => {
        this.log(`Update Stream Live`, `${guildId} : ${type} : ${isLive}`);
        switch (type) {
            case DetectPlatform.Afreeca:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "streamingStatus.isAfreecaStreamLive": isLive } });
                break;
            case DetectPlatform.Twitch:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "streamingStatus.isTwitchStreamLive": isLive } });
                break;
            case DetectPlatform.Chzzk:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "streamingStatus.isChzzkStreamLive": isLive } });
                break;
            default: return;
        }
    }

    getNewPostByPlatform = async (guildId: string, type: DetectPlatform): Promise<string[]> => {
        const info = await this.db.findOne({ id: guildId });
        if (!info) return [];
        switch (type) {
            case DetectPlatform.Afreeca:
                return info.lastCommunityPostIDs.afreecaPostId;
            case DetectPlatform.Chzzk:
                return info.lastCommunityPostIDs.chzzkPostId;
            default: return [];
        }
    }

    updateNewPostByPlatform = async (guildId: string, type: DetectPlatform, postId: string[]) => {
        this.log(`Update New Post`, `${guildId} : ${type} : ${postId}`);
        if (postId.length > 30) postId = postId.slice(-30);
        switch (type) {
            case DetectPlatform.Afreeca:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "lastCommunityPostIDs.afreecaPostId": postId } });
                break;
            case DetectPlatform.Chzzk:
                await this.db.findOneAndUpdate({ id: guildId }, { $set: { "lastCommunityPostIDs.chzzkPostId": postId } });
                break;
            default: return;
        }
    }

    getServerSettings = async (guildId: string): Promise<Settings> => {
        const info = await this.db.findOne({ id: guildId });
        return info.settings;
    }

    updateServerSettings = async (guildId: string, settings: Settings) => {
        this.log(`Update Server Settings`, `${guildId} : ${settings}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { settings: settings } });
    }

    updateDetectChannel = async (guildId: string, channelId: string) => {
        this.log(`Update Detect Channel`, `${guildId} : ${channelId}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { detectChannel: channelId } });
    }

    setEntranceChannel = async (guild: Guild, channelId: string) => {
        this.log(`Set Entrance Channel`, `${guild.name} : ${channelId}`);
        await this.db.findOneAndUpdate({ id: guild.id }, { $set: { "entrance.entranceChannelId": channelId } });
    }

    setNoticeChannel = async (guild: Guild, channelId: string) => {
        this.log(`Set Notice Channel`, `${guild.name} : ${channelId}`);
        await this.db.findOneAndUpdate({ id: guild.id }, { $set: { detectChannel: channelId } });
    }

    getDetectChannel = async (guildId: string): Promise<string> => (await this.db.findOne({ id: guildId })).detectChannel;
    getServerPostfix = async (guildId: string): Promise<string> => (await this.db.findOne({ id: guildId })).postfix;

    updateGuildPostfix = async (guildId: string, postfix: string) => {
        this.log(`Update Postfix`, `${guildId} : ${postfix}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { postfix: postfix } });
    }

    getServerMessageId = async (guildId: string): Promise<string> => (await this.db.findOne({ id: guildId })).detectMessageId;
    setServerMessageId = async (guildId: string, messageId: string) => {
        this.log(`Set Server Message ID`, `${guildId} : ${messageId}`);
        await this.db.findOneAndUpdate({ id: guildId }, { $set: { detectMessageId: messageId } });
    }

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

    readJsonFromFile = async (id: string): Promise<ServerInfo> => {
        try {
            const data = await this.db.findOne({ id: id }) as ServerInfo;
            return data;
        } catch (err) {
            console.error(`Failed to read JSON from file: ${err}`);
            throw err;
        }
    }

    SaveDataInfoFile = async (guildId: string, data: any) => {
        const time = new Date();
        const filePath = path.join(__dirname + "/../../archive/");
        if (!fss.existsSync(filePath)) fss.mkdirSync(filePath);
        const archiveFilePath = path.join(filePath, `${guildId}-${time.getFullYear()}-${time.getMonth()}-${time.getDate()}-${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}.json`);
        try {
            await fs.writeFile(archiveFilePath, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error(`Failed Save File : ${err}`);
        }
    }

    checkGuildExists = async (guildId: string): Promise<boolean> => {
        try {
            const filePath = path.join(this.dbPath(), `${guildId}.json`);
            await fs.access(filePath);
            return true;
        } catch (err) {
            return false;
        }
    }

    isServerExist = async (guildId: string): Promise<boolean> => {
        const data = await this.db.findOne({ id: guildId });
        return data ? true : false;
    }
}

export default new ServerRepository();