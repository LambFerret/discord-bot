import { Guild } from "discord.js";
import ServerRepository from "../repository/ServerRepository";
import { UserType } from "../model/UserType";
export default class ServerService {
    serverRepository: ServerRepository;
    constructor() {
        this.serverRepository = new ServerRepository();
    }

    createGuild(info: Guild) {
        return this.serverRepository.createNewServer(info);
    }

    getUserInfo = async (guildId: string, userId: string): Promise<UserType> => {
        return await this.serverRepository.checkIdInfo(guildId, userId)
    }

    async getStreamLiveInfo(guildId: string) : Promise<boolean | null> {
        return await this.serverRepository.checkStreamLive(guildId)
    }

    async updateStreamLive(guildId: string, isLive: boolean) {
        this.serverRepository.updateStreamLive(guildId, isLive)
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

}