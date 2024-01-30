import { DetectPlatform } from "../model/DetectType";
import ServerRepository from "../repository/ServerRepository";
import api from "../ExternalAPI";
import { EmbedBuilder } from "@discordjs/builders";
import { afreecaLiveInfoMsg, chzzkLiveInfoMsg, twitchLiveInfoMsg } from "../MessageFormat";
import { Client } from "discord.js";
import * as a from "node-cron";

export default class AlarmService {

    client: Client;
    constructor(client: Client) {
        this.client = client;
    }
    checkAlarm = async (guildId: string) => {
        const info = await ServerRepository.getDetectInfo(guildId);
        if (info.broadcastDetect.chzzk) {
            await this.sendChzzkBroadcastInfo(guildId);
        }
    }

    makeCron = async (guildId: string) => {
        // make cron of checkAlarm() 
        a.schedule('* * * * *', () => {
            this.checkAlarm(guildId);
        });
    }

    sendChzzkBroadcastInfo = async (guildId: string) => {
        const dto = await ServerRepository.checkStreamLive(guildId, DetectPlatform.Chzzk);
        if (dto.id === undefined) return undefined;
        const previousLiveInfo = dto.isLive;
        const liveInfo = await api.getChzzkLiveInfo(dto.id);

        if (!liveInfo) return;

        if (!liveInfo && previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Chzzk, false);
            return;
        }

        if (liveInfo.liveStatus && !previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Chzzk, true);
            this.say(guildId, chzzkLiveInfoMsg(liveInfo));
        }
    }

    sendAfreecaStreamInfo = async (guildId: string) => {
        const dto = await ServerRepository.checkStreamLive(guildId, DetectPlatform.Afreeca);
        if (dto.id === undefined) return undefined;
        const previousLiveInfo = dto.isLive;
        const liveInfo = await api.getAfreecaLiveInfo(dto.id);

        if (liveInfo === undefined) return;
        if (!liveInfo && !previousLiveInfo) return;

        if ((!liveInfo && previousLiveInfo) || (!liveInfo.isLive && previousLiveInfo)) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Afreeca, false);
            return;
        }

        if (liveInfo.isLive && !previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Afreeca, true);
            this.say(guildId, afreecaLiveInfoMsg(liveInfo));
        }
    }

    sendTwitchStreamInfo = async (guildId: string) => {
        const dto = await ServerRepository.checkStreamLive(guildId, DetectPlatform.Twitch);
        if (dto.id === undefined) return undefined;
        const previousLiveInfo = dto.isLive;
        const liveInfo = await api.getTwitchLiveInfo(dto.id);

        if (!liveInfo) return;

        if (!liveInfo && !previousLiveInfo) return;

        if (!liveInfo && previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Twitch, false);
            return;
        }

        if (liveInfo.type === 'live' && !previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Twitch, true);
            this.say(guildId, twitchLiveInfoMsg(liveInfo));
        }
    }


    sendYoutubeBroadcastInfo = async (guildId: string) => {
        // const info = await ServerRepository.getDetectInfo(guildId);
        // const liveInfo = await this.api.getYoutubeLiveInfo();

        // if (!liveInfo && !info.broadcastDetect.youtube) return undefined;

        // if (!liveInfo && info.broadcastDetect.youtube) {
        //     ServerRepository.updateBroadcastDetect(guildId, 'youtube', false);
        //     return undefined;
        // }

        // if (liveInfo && !info.broadcastDetect.youtube) {
        //     ServerRepository.updateBroadcastDetect(guildId, 'youtube', true);
        //     return youtubeLiveInfoMsg(liveInfo);
        // }

        // return undefined;
    }

    say = async (guildId: string, msg: EmbedBuilder) => {
        const channelID = await ServerRepository.getDetectChannel(guildId);
        const channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(channelID);
        if (channel && channel.isTextBased()) {
            channel.send({ embeds: [msg] });
        } else {
            console.log(`ERROR IN ALARM | guildID - ${guildId}, channelID - ${channelID}, message - ${msg.data.title}`);
        }
    }
}

