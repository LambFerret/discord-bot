"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ServerRepository_1 = tslib_1.__importDefault(require("../repository/ServerRepository"));
class ServerService {
    createServer(info) {
        return ServerRepository_1.default.createNewServer(info);
    }
    deleteServer(guildId) {
        return ServerRepository_1.default.deleteServerWithDB(guildId);
    }
    async getStreamLiveInfo(guildId, type) {
        return await ServerRepository_1.default.checkStreamLive(guildId, type);
    }
    async updateStreamLive(guildId, type, isLive) {
        await ServerRepository_1.default.updateStreamLive(guildId, type, isLive);
    }
    async updateDetectChannel(guildId, channelId) {
        await ServerRepository_1.default.updateDetectChannel(guildId, channelId);
    }
    async getDetectChannel(guildId) {
        return await ServerRepository_1.default.getDetectChannel(guildId);
    }
    async getGuildPostfix(guildId) {
        return await ServerRepository_1.default.getServerPostfix(guildId);
    }
    async updateGuildPostfix(guildId, postfix) {
        return await ServerRepository_1.default.updateGuildPostfix(guildId, postfix);
    }
    async getEntranceInfo(guildId) {
        return await ServerRepository_1.default.getEntranceInfo(guildId);
    }
    async saveEntranceMessageId(guildId, messageId) {
        ServerRepository_1.default.saveEntranceMessageId(guildId, messageId);
    }
    async updateGuildEntranceQuote(guildId, quote) {
        ServerRepository_1.default.updateGuildEntranceQuote(guildId, quote);
    }
    async updateGuildEntranceEmoji(guildId, emoji) {
        ServerRepository_1.default.updateGuildEntranceEmoji(guildId, emoji);
    }
    async updateGuildEntranceRole(guildId, role) {
        ServerRepository_1.default.updateGuildEntranceRole(guildId, role);
    }
    async isServerExist(guildId) {
        return await ServerRepository_1.default.isServerExist(guildId);
    }
}
exports.default = new ServerService();
//# sourceMappingURL=ServerService.js.map