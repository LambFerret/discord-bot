import { Guild } from "discord.js";
import ServerRepository from "../repository/ServerRepository";
import { UserType } from "../model/UserType";
import { StreamType } from "../ExternalAPI";
export default class ServerService {
    serverRepository: ServerRepository;
    constructor() {
        this.serverRepository = new ServerRepository();
    }

    createGuild(info: Guild) {
        return this.serverRepository.createNewServer(info);
    }

    deleteGuild(guildId: string) {
        return this.serverRepository.deleteServer(guildId);
    }

    getUserInfo = async (guildId: string, userId: string): Promise<UserType> => {
        return await this.serverRepository.checkIdInfo(guildId, userId)
    }

    async getStreamLiveInfo(guildId: string, type : StreamType) : Promise<boolean | null> {
        return await this.serverRepository.checkStreamLive(guildId, type)
    }

    async updateStreamLive(guildId: string, type :StreamType, isLive: boolean) {
        await this.serverRepository.updateStreamLive(guildId,type, isLive)
    }

    async updateDetectChannel(guildId: string, channelId: string) {
        await this.serverRepository.updateDetectChannel(guildId, channelId)
    }

    async getDetectChannel(guildId: string): Promise<string> {
        return await this.serverRepository.getDetectChannel(guildId)
    }

    async getAllGuildId(): Promise<string[]> {
        return await this.serverRepository.getAllGuildId()
    }

 
    updateModeratorId(guildId: string, userId: string[]) {
        this.serverRepository.updateModerators(guildId, userId)
    }

    updateBotMaker(guildId: string, botMaker: string) {
        this.serverRepository.updateBotMaker(guildId, botMaker)
    }

    async getGuildPrefix(guildId: string): Promise<string> {
        return await this.serverRepository.getServerPrefix(guildId)
    }

    async getGuildPostfix(guildId: string): Promise<string> {
        return await this.serverRepository.getServerPostfix(guildId)
    }

    async updateGuildPrefix(guildId: string, postfix: string, isPrefix: boolean) {
        this.serverRepository.updateServerPrefix(guildId, postfix, isPrefix)
    }

    async getEntraceInfo(guildId: string) {
        return await this.serverRepository.getEntranceInfo(guildId)
    }

    async saveEntranceMessageId(guildId: string, messageId: string) {
        this.serverRepository.saveEntranceMessageId(guildId, messageId)
    }

    async updateGuildEntranceQuote(guildId: string, quote: string) {
        this.serverRepository.updateGuildEntranceQuote(guildId, quote)
    }

    async updateGuildEntranceEmoji(guildId: string, emoji: string) {
        this.serverRepository.updateGuildEntranceEmoji(guildId, emoji)
    }

    async updateGuildEntranceRole(guildId: string, role: string) {
        this.serverRepository.updateGuildEntranceRole(guildId, role)
    }

    async updateStreamDetecting(guildId: string, isDetecting: boolean) {
        this.serverRepository.updateStreamDetecting(guildId, isDetecting)
    }

    async initDetecting() {
        return this.serverRepository.initDetecting();
    }

}