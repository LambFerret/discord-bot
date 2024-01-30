import { Guild } from "discord.js";
import { DetectPlatform } from "../model/DetectType";
import { UserType } from "../model/UserType";
import serverRepository from "../repository/ServerRepository";
class ServerService {

    createServer(info: Guild) {
        serverRepository.createNewServer(info);
    }

    deleteServer(guildId: string) {
        return serverRepository.deleteServer(guildId);
    }

    getUserInfo = async (guildId: string, userId: string): Promise<UserType> => {
        return await serverRepository.checkIdInfo(guildId, userId)
    }

    async getStreamLiveInfo(guildId: string, type : DetectPlatform) {
        return await serverRepository.checkStreamLive(guildId, type)
    }

    async updateStreamLive(guildId: string, type :DetectPlatform, isLive: boolean) {
        await serverRepository.updateStreamLive(guildId,type, isLive)
    }

    async updateDetectChannel(guildId: string, channelId: string) {
        await serverRepository.updateDetectChannel(guildId, channelId)
    }

    async getDetectChannel(guildId: string): Promise<string> {
        return await serverRepository.getDetectChannel(guildId)
    }

    async getAllGuildId(): Promise<string[]> {
        return await serverRepository.getAllGuildId()
    }
 
    updateModeratorId(guildId: string, userId: string[]) {
        serverRepository.updateModerators(guildId, userId)
    }

    updateBotMaker(guildId: string, botMaker: string) {
        serverRepository.updateBotMaker(guildId, botMaker)
    }

    async getGuildPrefix(guildId: string): Promise<string> {
        return await serverRepository.getServerPrefix(guildId)
    }

    async getGuildPostfix(guildId: string): Promise<string> {
        return await serverRepository.getServerPostfix(guildId)
    }

    async updateGuildPrefix(guildId: string, postfix: string, isPrefix: boolean) {
        serverRepository.updateServerPrefix(guildId, postfix, isPrefix)
    }

    async getEntraceInfo(guildId: string) {
        return await serverRepository.getEntranceInfo(guildId)
    }

    async saveEntranceMessageId(guildId: string, messageId: string) {
        serverRepository.saveEntranceMessageId(guildId, messageId)
    }

    async updateGuildEntranceQuote(guildId: string, quote: string) {
        serverRepository.updateGuildEntranceQuote(guildId, quote)
    }

    async updateGuildEntranceEmoji(guildId: string, emoji: string) {
        serverRepository.updateGuildEntranceEmoji(guildId, emoji)
    }

    async updateGuildEntranceRole(guildId: string, role: string) {
        serverRepository.updateGuildEntranceRole(guildId, role)
    }

    async updateStreamDetecting(guildId: string, isDetecting: boolean) {
        serverRepository.updateStreamDetecting(guildId, isDetecting)
    }

    async getAllServers() {
        return serverRepository.getAllServers();
    }
}

export default new ServerService();