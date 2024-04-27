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
        const info = await this.readJsonFromDB(guildId);
        return info.entrance;
    }

    getDetectInfo = async (guildId: string) => {
        const info = await this.readJsonFromDB(guildId);
        return info.serverDetectInfos;
    }

    getDetectID = async (guildId: string, platform: DetectPlatform) => {
        const info = await this.readJsonFromDB(guildId);
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
                this.db.findOneAndUpdate({ id: guildId }, { $set: { broadcastInfo: { AfreecaId: id } } });
                break;
            case DetectPlatform.Chzzk:
                this.db.findOneAndUpdate({ id: guildId }, { $set: { broadcastInfo: { ChzzkId: id } } });
                break;
            case DetectPlatform.Twitch:
                this.db.findOneAndUpdate({ id: guildId }, { $set: { broadcastInfo: { TwitchId: id } } });
                break;
            default: return;
        }
    }

    updateDetectInfo = async (guildId: string, channelId: string, type: DetectType, platform: DetectPlatform, setActive: boolean) => {
        this.log(`Update Detect Info`, `${guildId} : ${channelId} : ${type} : ${platform} : ${setActive}`);
        const info = await this.readJsonFromDB(guildId);
        if (info.detectChannel === "") this.db.findOneAndUpdate({ id: guildId }, { $set: { detectChannel: channelId } });
        switch (type) {
            case DetectType.Broadcast:
                switch (platform) {
                    case DetectPlatform.Chzzk:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { broadcastDetect: { chzzk: setActive } } } });
                        break;
                    case DetectPlatform.Afreeca:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { broadcastDetect: { afreeca: setActive } } } });
                        break;
                    case DetectPlatform.Twitch:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { broadcastDetect: { twitch: setActive } } } });
                        break;
                    default: return;
                }
                break;
            case DetectType.NewPost:
                switch (platform) {
                    case DetectPlatform.Chzzk:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { newPostDetect: { chzzk: setActive } } } });
                        break;
                    case DetectPlatform.Afreeca:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { newPostDetect: { afreeca: setActive } } } });
                        break;
                    default: return;
                }
                break;
            case DetectType.OwnerChat:
                switch (platform) {
                    case DetectPlatform.Chzzk:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { ownerChatDetect: { chzzk: setActive } } } });
                        break;
                    case DetectPlatform.Afreeca:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { ownerChatDetect: { afreeca: setActive } } } });
                        break;
                    default: return;
                }
                break;
            case DetectType.Else:
                switch (platform) {
                    case DetectPlatform.NaverCafe:
                        this.db.findOneAndUpdate({ id: guildId }, { $set: { serverDetectInfos: { elseDetect: { naverCafe: setActive } } } });
                        break;
                    default: return;
                }
                break;
            default: return;
        }
    }

    saveEntranceMessageId = async (guildId: string, messageId: string) => {
        this.log(`Save Entrance Message ID`, `${guildId} : ${messageId}`);
        const info = await this.readJsonFromFile(guildId);
        info.entrance.messageId = messageId;
        await this.writeJsonAsFile(info);
    }

    updateGuildEntranceQuote = async (guildId: string, quote: string) => {
        this.log(`Update Entrance Quote`, `${guildId} : ${quote}`);
        const info = await this.readJsonFromFile(guildId);
        info.entrance.quote = quote;
        await this.writeJsonAsFile(info);
    }

    updateGuildEntranceEmoji = async (guildId: string, emoji: string) => {
        this.log(`Update Entrance Emoji`, `${guildId} : ${emoji}`);
        const info = await this.readJsonFromFile(guildId);
        info.entrance.emoji = emoji;
        await this.writeJsonAsFile(info);
    }

    updateGuildEntranceRole = async (guildId: string, role: string) => {
        this.log(`Update Entrance Role`, `${guildId} : ${role}`);
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
        }
        return liveDTO;
    }

    updateStreamLive = async (guildId: string, type: DetectPlatform, isLive: boolean) => {
        this.log(`Update Stream Live`, `${guildId} : ${type} : ${isLive}`);
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
            default: return [];
        }
    }

    updateNewPostByPlatform = async (guildId: string, type: DetectPlatform, postId: string[]) => {
        this.log(`Update New Post`, `${guildId} : ${type} : ${postId}`);
        if (postId.length > 30) postId = postId.slice(-30);
        const info = await this.readJsonFromFile(guildId);
        switch (type) {
            case DetectPlatform.Afreeca:
                info.lastCommunityPostIDs.afreecaPostId = postId;
                break;
            case DetectPlatform.Chzzk:
                info.lastCommunityPostIDs.chzzkPostId = postId;
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
        this.log(`Update Server Settings`, `${guildId} : ${settings}`);
        const info = await this.readJsonFromFile(guildId);
        info.settings = settings;
        await this.writeJsonAsFile(info);
    }

    updateDetectChannel = async (guildId: string, channelId: string) => {
        this.log(`Update Detect Channel`, `${guildId} : ${channelId}`);
        const info = await this.readJsonFromFile(guildId);
        info.detectChannel = channelId;
        await this.writeJsonAsFile(info);
    }

    setEntranceChannel = async (guild: Guild, channelId: string) => {
        this.log(`Set Entrance Channel`, `${guild.name} : ${channelId}`);
        const info = await this.readJsonFromFile(guild.id);
        info.entrance.entranceChannelId = channelId;
        await this.writeJsonAsFile(info);
    }

    setNoticeChannel = async (guild: Guild, channelId: string) => {
        this.log(`Set Notice Channel`, `${guild.name} : ${channelId}`);
        const info = await this.readJsonFromFile(guild.id);
        info.detectChannel = channelId;
        await this.writeJsonAsFile(info);
    }

    getDetectChannel = async (guildId: string): Promise<string> => (await this.readJsonFromFile(guildId)).detectChannel;
    getServerPostfix = async (guildId: string): Promise<string> => (await this.readJsonFromFile(guildId)).postfix;

    updateGuildPostfix = async (guildId: string, postfix: string) => {
        this.log(`Update Postfix`, `${guildId} : ${postfix}`);
        const info = await this.readJsonFromFile(guildId);
        info.postfix = postfix;
        await this.writeJsonAsFile(info);
    }

    getServerMessageId = async (guildId: string): Promise<string> => (await this.readJsonFromFile(guildId)).detectMessageId;
    setServerMessageId = async (guildId: string, messageId: string) => {
        this.log(`Set Server Message ID`, `${guildId} : ${messageId}`);
        const info = await this.readJsonFromFile(guildId);
        info.detectMessageId = messageId;
        await this.writeJsonAsFile(info);
    }

    writeJsonAsFile = async (info: ServerInfo) => {
        try {
            // const filePath = path.join(this.dbPath(), `${info.id}.json`);
            // await fs.writeFile(filePath, JSON.stringify(info, null, 2));
            console.log(`I Just Pretend to .. : Server ${info.id} save successfully!`);
        } catch (err) {
            console.error(`Failed to create server: ${err}`);
        }
    }
    readRawJsonFromFile = async (fileName: string): Promise<ServerInfo> => {
        const filePath = path.join(this.dbPath(),fileName);
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

    readJsonFromDB = async (id: string): Promise<ServerInfo> => {
        try {
            return await this.db.findOne({ id: id }) as ServerInfo;
        } catch (err) {
            console.error(`Failed to read JSON from file: ${err}`);
            throw err;
        }
    }

    transferJsonToDB = async () => {
        // find all json file and insert to db
        for (const file of await fs.readdir(this.dbPath())) {
            let info: ServerInfo;
            try {
                info = await this.readRawJsonFromFile(file);
            } catch (err) {
                continue;
            }
            if (info) {
                await this.db.insertOne(info);
            }
        }
    }

    archiveServerFile = async (guildId: string) => {
        const time = new Date();
        const archivePath = path.join(__dirname + "/../../archive/");
        if (!fss.existsSync(archivePath)) fss.mkdirSync(archivePath);
        const filePath = path.join(this.dbPath(), `${guildId}.json`);
        const archiveFilePath = path.join(archivePath, `${guildId}-${time.getFullYear()}-${time.getMonth()}-${time.getDate()}-${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}.json`);
        await fs.rename(filePath, archiveFilePath);
    }

    SaveDataInfoFile = async (guildId : string, data : any) => {
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

    updateServerStreamer = (guildId: string) => {

    }

    getAllServers = async (): Promise<ServerInfo[]> => {
        const detectingServers: ServerInfo[] = [];
        for (const file of await fs.readdir(this.dbPath())) {
            let info: ServerInfo;
            try {
                info = await this.readJsonFromFile(file.replace('.json', ''));
            } catch (err) {
                console.error(`Abort Application`);
                process.exit(1);
            }
            if (info) detectingServers.push(info);
        }

        return detectingServers;
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

}


export default new ServerRepository();