import { ServerInfo, Entrance } from "../model/ServerType";
import { Guild } from "discord.js";
import fs from 'fs/promises';
import * as fss from 'fs';
import path from 'path';
import { UserType } from "../model/UserType";
import { StreamType } from "../ExternalAPI";

export default class ServerRepository {

    dbPath = (): string => {
        if (!fss.existsSync(__dirname + "/../../db/")) fss.mkdirSync(__dirname + "/../../db/");
        return path.join(__dirname + "/../../db/");
    }

    createNewServer = async (info: Guild) => {
        const entrance: Entrance = {
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
            MyId: "",
            ModeratorId: [],
            prefix: '쟌코봇치야',
            postfix: '삐삐리뽀',
            status: 'INIT',
            entrance: entrance,
            isTwitchStreamLive: false,
            isAfreecaStreamLive: false,
            isDetecting: false,
            isDeleted: false,
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

    saveEntranceMessageId = async (guildId: string, messageId: string) => {
        const info = await this.readJsonFromFile(guildId);
        info.entrance.messageId = messageId;
        await this.writeJsonAsFile(info);
    }

    updateStreamDetecting = async (guildId: string, isDetecting: boolean) => {
        const info = await this.readJsonFromFile(guildId);
        info.isDetecting = isDetecting;
        await this.writeJsonAsFile(info);
    }

    updateServerPrefix = async (guildId: string, prefix: string, isPrefix: boolean) => {
        try {
            const info = await this.readJsonFromFile(guildId);
            if (isPrefix) info.prefix = prefix;
            else info.postfix = prefix;
            await this.writeJsonAsFile(info);
            console.log(`Server ${guildId} prefix updated successfully!`);
        } catch (err) {
            console.error(`Failed to update server prefix: ${err}`);
        }
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

    checkStreamLive = async (guildId: string, type: StreamType): Promise<boolean | null> => {
        const info = await this.readJsonFromFile(guildId);
        if (info.isDetecting) {
            switch (type) {
                case StreamType.Afreeca:
                    return info.isAfreecaStreamLive;
                case StreamType.Twitch:
                    return info.isTwitchStreamLive;
                default: return null;
            }
        }
        return null;
    }

    updateStreamLive = async (guildId: string, type: StreamType, isLive: boolean) => {
        const info = await this.readJsonFromFile(guildId);
        switch (type) {
            case StreamType.Afreeca:
                info.isAfreecaStreamLive = isLive;
                break;
            case StreamType.Twitch:
                info.isTwitchStreamLive = isLive;
                break;
            default: return;
        }
        await this.writeJsonAsFile(info);
    }


    checkIdInfo = async (guildId: string, id: string): Promise<UserType> => {
        const info = await this.readJsonFromFile(guildId);
        switch (id) {
            case info.OwnerId:
                return UserType.Owner

            case info.MyId:
                return UserType.BotMaker
            default: {
                if (info.ModeratorId.includes(id)) {
                    return UserType.Moderator
                } else {
                    return UserType.Normal

                }
            }
        }
    }

    updateDetectChannel = async (guildId: string, channelId: string) => {
        const info = await this.readJsonFromFile(guildId);
        info.detectChannel = channelId;
        await this.writeJsonAsFile(info);
    }


    updateModerators = async (guildId: string, moderator: string[]) => {
        const info = await this.readJsonFromFile(guildId);
        if (!moderator) info.ModeratorId = moderator;
        await this.writeJsonAsFile(info);
    }

    updateBotMaker = async (guildId: string, botMaker: string) => {
        const info = await this.readJsonFromFile(guildId);
        info.MyId = botMaker;
        await this.writeJsonAsFile(info);
    }

    getDetectChannel = async (guildId: string): Promise<string> => (await this.readJsonFromFile(guildId)).detectChannel;
    getServerPrefix = async (guildId: string): Promise<string> => (await this.readJsonFromFile(guildId)).prefix;
    getServerPostfix = async (guildId: string): Promise<string> => (await this.readJsonFromFile(guildId)).postfix;

    writeJsonAsFile = async (info: ServerInfo) => {
        try {
            const filePath = path.join(this.dbPath(), `${info.id}.json`);
            await fs.writeFile(filePath, JSON.stringify(info, null, 2));
            console.log(`Server ${info.id} created successfully!`);
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

    initDetecting = async () => {
        const detectingServers: ServerInfo[] = [];
        for (const file of await fs.readdir(this.dbPath())) {
            const filePath = path.join(this.dbPath(), file);
            const data = await fs.readFile(filePath, 'utf-8');
            const info = JSON.parse(data) as ServerInfo;
            if (info.isDetecting) {
                detectingServers.push(info);
            }
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

