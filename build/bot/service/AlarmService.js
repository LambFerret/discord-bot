"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cron = tslib_1.__importStar(require("node-cron"));
const ExternalAPI_1 = tslib_1.__importDefault(require("../ExternalAPI"));
const MessageFormat_1 = require("../MessageFormat");
const DetectType_1 = require("../model/DetectType");
const ServerRepository_1 = tslib_1.__importDefault(require("../repository/ServerRepository"));
class AlarmService {
    client;
    activeCronJobs;
    constructor(client) {
        this.client = client;
        this.activeCronJobs = {};
    }
    checkAlarm = async (guildId) => {
        let info;
        try {
            info = await ServerRepository_1.default.getDetectInfo(guildId);
        }
        catch (e) {
            return;
        }
        if (!info)
            return;
        if (info.broadcastDetect.chzzk) {
            await this.sendChzzkStreamInfo(guildId);
        }
        if (info.broadcastDetect.afreeca) {
            await this.sendAfreecaStreamInfo(guildId);
        }
        if (info.broadcastDetect.twitch) {
            await this.sendTwitchStreamInfo(guildId);
        }
        // if (info.broadcastDetect.youtube) {
        //     await this.sendYoutubeStreamInfo(guildId);
        // }
    };
    makeCron = (guildId) => {
        if (this.activeCronJobs[guildId]) {
            this.activeCronJobs[guildId].stop();
            delete this.activeCronJobs[guildId];
        }
        const task = cron.schedule('* * * * *', () => {
            this.checkAlarm(guildId);
        });
        this.activeCronJobs[guildId] = task;
    };
    sendChzzkStreamInfo = async (guildId) => {
        const dto = await ServerRepository_1.default.checkStreamLive(guildId, DetectType_1.DetectPlatform.Chzzk);
        if (dto.id === undefined)
            return;
        if (dto.id === "")
            return;
        const previousLiveInfo = dto.isLive;
        const liveInfo = await ExternalAPI_1.default.getChzzkLiveInfo(dto.id);
        if (!liveInfo)
            return;
        if (!liveInfo.liveStatus && previousLiveInfo) {
            ServerRepository_1.default.updateStreamLive(guildId, DetectType_1.DetectPlatform.Chzzk, false);
            const serverSetting = await ServerRepository_1.default.getServerSettings(guildId);
            if (serverSetting.erasePreviousMessage) {
                const messageId = await ServerRepository_1.default.getServerMessageId(guildId);
                if (!messageId)
                    return;
                // delete message 
                const channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(await ServerRepository_1.default.getDetectChannel(guildId));
                if (channel && channel.isTextBased()) {
                    channel.messages.fetch(messageId).then(msg => msg.delete());
                }
            }
            return;
        }
        if (liveInfo.liveStatus && !previousLiveInfo) {
            ServerRepository_1.default.updateStreamLive(guildId, DetectType_1.DetectPlatform.Chzzk, true);
            const message = await this.say(guildId, await (0, MessageFormat_1.chzzkLiveInfoMsg)(guildId, liveInfo));
            if (message && message.id) {
                ServerRepository_1.default.setServerMessageId(guildId, message.id);
            }
        }
    };
    sendAfreecaStreamInfo = async (guildId) => {
        const dto = await ServerRepository_1.default.checkStreamLive(guildId, DetectType_1.DetectPlatform.Afreeca);
        if (dto.id === undefined)
            return;
        if (dto.id === "")
            return;
        const previousLiveInfo = dto.isLive;
        const liveInfo = await ExternalAPI_1.default.getAfreecaLiveInfo(dto.id);
        if (liveInfo === undefined)
            return;
        if (!liveInfo && !previousLiveInfo)
            return;
        if ((!liveInfo && previousLiveInfo) || (!liveInfo.isLive && previousLiveInfo)) {
            ServerRepository_1.default.updateStreamLive(guildId, DetectType_1.DetectPlatform.Afreeca, false);
            const serverSetting = await ServerRepository_1.default.getServerSettings(guildId);
            if (serverSetting.erasePreviousMessage) {
                const messageId = await ServerRepository_1.default.getServerMessageId(guildId);
                if (!messageId)
                    return;
                // delete message 
                const channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(await ServerRepository_1.default.getDetectChannel(guildId));
                if (channel && channel.isTextBased()) {
                    channel.messages.fetch(messageId).then(msg => msg.delete());
                }
            }
            return;
        }
        if (liveInfo.isLive && !previousLiveInfo) {
            ServerRepository_1.default.updateStreamLive(guildId, DetectType_1.DetectPlatform.Afreeca, true);
            const message = await this.say(guildId, await (0, MessageFormat_1.afreecaLiveInfoMsg)(guildId, liveInfo));
            if (message && message.id) {
                ServerRepository_1.default.setServerMessageId(guildId, message.id);
            }
        }
    };
    sendTwitchStreamInfo = async (guildId) => {
        const dto = await ServerRepository_1.default.checkStreamLive(guildId, DetectType_1.DetectPlatform.Twitch);
        if (dto.id === undefined)
            return;
        if (dto.id === "")
            return;
        const previousLiveInfo = dto.isLive;
        const liveInfo = await ExternalAPI_1.default.getTwitchLiveInfo(dto.id);
        if (!liveInfo)
            return;
        if (!liveInfo && !previousLiveInfo)
            return;
        if (!liveInfo && previousLiveInfo) {
            ServerRepository_1.default.updateStreamLive(guildId, DetectType_1.DetectPlatform.Twitch, false);
            const serverSetting = await ServerRepository_1.default.getServerSettings(guildId);
            if (serverSetting.erasePreviousMessage) {
                const messageId = await ServerRepository_1.default.getServerMessageId(guildId);
                if (!messageId)
                    return;
                // delete message 
                const channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(await ServerRepository_1.default.getDetectChannel(guildId));
                if (channel && channel.isTextBased()) {
                    channel.messages.fetch(messageId).then(msg => msg.delete());
                }
            }
            return;
        }
        if (liveInfo.type === 'live' && !previousLiveInfo) {
            ServerRepository_1.default.updateStreamLive(guildId, DetectType_1.DetectPlatform.Twitch, true);
            const message = await this.say(guildId, await (0, MessageFormat_1.twitchLiveInfoMsg)(guildId, liveInfo));
            if (message && message.id) {
                ServerRepository_1.default.setServerMessageId(guildId, message.id);
            }
        }
    };
    sendYoutubeStreamInfo = async (guildId) => {
        /*
        const dto = await ServerRepository.checkStreamLive(guildId, DetectPlatform.Youtube);

        if (dto.id === undefined) return;
        if (dto.id === "") return;
        const previousLiveInfo = dto.isLive;
        const liveInfo = await api.getYoutubeLiveInfo(dto.id);

        if (!liveInfo) return;

        if (!liveInfo && !previousLiveInfo) return;

        if (liveInfo.id === "" && previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Youtube, false);
            return;
        }

        if (liveInfo.id !== "" && !previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Youtube, true);
            this.say(guildId, await youtubeLiveInfoMsg(guildId, liveInfo));
        }
        */
    };
    say = async (guildId, msg) => {
        const channelID = await ServerRepository_1.default.getDetectChannel(guildId);
        const setting = await ServerRepository_1.default.getServerSettings(guildId);
        const channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(channelID);
        if (channel && channel.isTextBased()) {
            return channel.send({ content: setting.liveIncludeEveryone ? "@everyone" : "", embeds: [msg] });
        }
        else {
            console.log(`ERROR IN ALARM | guildID - ${guildId}, channelID - ${channelID}, message - ${msg.data.title}`);
        }
    };
    test = async (guildId) => {
        const serverSetting = await ServerRepository_1.default.getServerSettings(guildId);
        if (serverSetting.erasePreviousMessage) {
            const messageId = await ServerRepository_1.default.getServerMessageId(guildId);
            if (!messageId)
                return;
            // delete message 
            const channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(await ServerRepository_1.default.getDetectChannel(guildId));
            if (channel && channel.isTextBased()) {
                channel.messages.fetch(messageId).then(msg => msg.delete());
            }
        }
    };
}
exports.default = AlarmService;
//# sourceMappingURL=AlarmService.js.map