import { Guild } from "discord.js";
import { DetectPlatform } from "../model/DetectType";
import { ServerInfo } from "../model/ServerType";
import serverRepository from "../repository/ServerRepository";
class ServerService {

    createServer(info: Guild) : Promise<ServerInfo> {
        return serverRepository.createNewServer(info);
    }

    deleteServer(guildId: string) {
        return serverRepository.deleteServerWithDB(guildId);
    }

    async getStreamLiveInfo(guildId: string, type: DetectPlatform) {
        return await serverRepository.checkStreamLive(guildId, type)
    }

    async updateStreamLive(guildId: string, type: DetectPlatform, isLive: boolean) {
        await serverRepository.updateStreamLive(guildId, type, isLive)
    }

    async updateDetectChannel(guildId: string, channelId: string) {
        await serverRepository.updateDetectChannel(guildId, channelId)
    }

    async getDetectChannel(guildId: string): Promise<string> {
        return await serverRepository.getDetectChannel(guildId)
    }

    async getGuildPostfix(guildId: string): Promise<string> {
        return await serverRepository.getServerPostfix(guildId)
    }

    async updateGuildPostfix(guildId: string, postfix: string) {
        return await serverRepository.updateGuildPostfix(guildId, postfix)
    }

    async getEntranceInfo(guildId: string) {
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

    async isServerExist(guildId: string): Promise<boolean> {
        return await serverRepository.isServerExist(guildId)
    }
}

export default new ServerService();