import { EmbedBuilder } from "@discordjs/builders";
import { Client } from "discord.js";
import * as cron from "node-cron";
import api from "../ExternalAPI";
import { afreecaLiveInfoMsg, chzzkLiveInfoMsg, twitchLiveInfoMsg } from "../MessageFormat";
import { DetectPlatform } from "../model/DetectType";
import ServerRepository from "../repository/ServerRepository";

export default class AlarmService {

    client: Client;
    activeCronJobs: { [key: string]: cron.ScheduledTask };
    constructor(client: Client) {
        this.client = client;
        this.activeCronJobs = {};
    }

    checkAlarm = async (guildId: string) => {
        let info;
        try {
            info = await ServerRepository.getDetectInfo(guildId);
        } catch (e) {
            return;
        }
        if (!info) return;
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
    }

    makeCron = (guildId: string) => {
        if (this.activeCronJobs[guildId]) {
            this.activeCronJobs[guildId].stop();
            delete this.activeCronJobs[guildId];
        }

        const task = cron.schedule('* * * * *', () => {
            this.checkAlarm(guildId);
        });
        this.activeCronJobs[guildId] = task;
    }

    sendChzzkStreamInfo = async (guildId: string) => {
        const dto = await ServerRepository.checkStreamLive(guildId, DetectPlatform.Chzzk);
        if (dto.id === undefined) return;
        if (dto.id === "") return;
        const previousLiveInfo = dto.isLive;
        const liveInfo = await api.getChzzkLiveInfo(dto.id);

        if (!liveInfo) return;

        if (!liveInfo.liveStatus && previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Chzzk, false);
            const serverSetting = await ServerRepository.getServerSettings(guildId);
            if (serverSetting.erasePreviousMessage) {
                const messageId = await ServerRepository.getServerMessageId(guildId);
                if (!messageId) return;
                // delete message 
                const channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(await ServerRepository.getDetectChannel(guildId));
                if (channel && channel.isTextBased()) {
                    channel.messages.fetch(messageId).then(msg => msg.delete());
                }
            }
            return;
        }

        if (liveInfo.liveStatus && !previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Chzzk, true);
            const message = await this.say(guildId, await chzzkLiveInfoMsg(guildId, liveInfo));
            if (message && message.id) {
                ServerRepository.setServerMessageId(guildId, message.id);
            }
        }
    }

    sendAfreecaStreamInfo = async (guildId: string) => {
        const dto = await ServerRepository.checkStreamLive(guildId, DetectPlatform.Afreeca);
        if (dto.id === undefined) return;
        if (dto.id === "") return;
        const previousLiveInfo = dto.isLive;
        const liveInfo = await api.getAfreecaLiveInfo(dto.id);

        if (liveInfo === undefined) return;
        if (!liveInfo && !previousLiveInfo) return;

        if ((!liveInfo && previousLiveInfo) || (!liveInfo.isLive && previousLiveInfo)) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Afreeca, false);
            const serverSetting = await ServerRepository.getServerSettings(guildId);
            if (serverSetting.erasePreviousMessage) {
                const messageId = await ServerRepository.getServerMessageId(guildId);
                if (!messageId) return;
                // delete message 
                const channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(await ServerRepository.getDetectChannel(guildId));
                if (channel && channel.isTextBased()) {
                    channel.messages.fetch(messageId).then(msg => msg.delete());
                }
            }
            return;
        }

        if (liveInfo.isLive && !previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Afreeca, true);
            const message = await this.say(guildId, await afreecaLiveInfoMsg(guildId, liveInfo));
            if (message && message.id) {
                ServerRepository.setServerMessageId(guildId, message.id);
            }
        }
    }

    sendTwitchStreamInfo = async (guildId: string) => {
        const dto = await ServerRepository.checkStreamLive(guildId, DetectPlatform.Twitch);
        if (dto.id === undefined) return;
        if (dto.id === "") return;
        const previousLiveInfo = dto.isLive;
        const liveInfo = await api.getTwitchLiveInfo(dto.id);

        if (!liveInfo) return;

        if (!liveInfo && !previousLiveInfo) return;

        if (!liveInfo && previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Twitch, false);
            const serverSetting = await ServerRepository.getServerSettings(guildId);
            if (serverSetting.erasePreviousMessage) {
                const messageId = await ServerRepository.getServerMessageId(guildId);
                if (!messageId) return;
                // delete message 
                const channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(await ServerRepository.getDetectChannel(guildId));
                if (channel && channel.isTextBased()) {
                    channel.messages.fetch(messageId).then(msg => msg.delete());
                }
            }
            return;
        }

        if (liveInfo.type === 'live' && !previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Twitch, true);
            const message = await this.say(guildId, await twitchLiveInfoMsg(guildId, liveInfo));
            if (message && message.id) {
                ServerRepository.setServerMessageId(guildId, message.id);
            }
        }
    }


    sendYoutubeStreamInfo = async (guildId: string) => {
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
    }

    say = async (guildId: string, msg: EmbedBuilder) => {
        const channelID = await ServerRepository.getDetectChannel(guildId);
        const setting = await ServerRepository.getServerSettings(guildId);
        const channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(channelID);
        if (channel && channel.isTextBased()) {
            return channel.send({ content: setting.liveIncludeEveryone ? "@everyone" : "", embeds: [msg] });
        } else {
            console.log(`ERROR IN ALARM | guildID - ${guildId}, channelID - ${channelID}, message - ${msg.data.title}`);
        }
    }

    test = async (guildId:string) => {
        const serverSetting = await ServerRepository.getServerSettings(guildId);
        if (serverSetting.erasePreviousMessage) {
            const messageId = await ServerRepository.getServerMessageId(guildId);
            if (!messageId) return;
            // delete message 
            const channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(await ServerRepository.getDetectChannel(guildId));
            if (channel && channel.isTextBased()) {
                channel.messages.fetch(messageId).then(msg => msg.delete());
            }
        }
    }
}

