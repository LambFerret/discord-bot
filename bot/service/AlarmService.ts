import { EmbedBuilder } from "@discordjs/builders";
import { Client } from "discord.js";
import * as cron from "node-cron";
import api from "../ExternalAPI";
import { afreecaLiveInfoMsg, chzzkLiveInfoMsg, twitchLiveInfoMsg, youtubeLiveInfoMsg } from "../MessageFormat";
import { DetectPlatform } from "../model/DetectType";
import ServerRepository from "../repository/ServerRepository";

export default class AlarmService {

    client: Client;
    constructor(client: Client) {
        this.client = client;
    }
    checkAlarm = async (guildId: string) => {
        const info = await ServerRepository.getDetectInfo(guildId);
        // if (info.broadcastDetect.chzzk) {
        //     await this.sendChzzkStreamInfo(guildId);
        // }
        // if (info.broadcastDetect.afreeca) {
        //     await this.sendAfreecaStreamInfo(guildId);
        // }
        // if (info.broadcastDetect.twitch) {
        //     await this.sendTwitchStreamInfo(guildId);
        // }
        if (info.broadcastDetect.youtube) {
            await this.sendYoutubeStreamInfo(guildId);
        }
    }

    makeCron = (guildId: string) => {
        // make cron of checkAlarm() 
        cron.schedule('* * * * *', () => {
            this.checkAlarm(guildId);
        });
    }

    sendChzzkStreamInfo = async (guildId: string) => {
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


    sendYoutubeStreamInfo = async (guildId: string) => {
        const dto = await ServerRepository.checkStreamLive(guildId, DetectPlatform.Youtube);
        console.log(dto);
        
        if (dto.id === undefined) return undefined;
        const previousLiveInfo = dto.isLive;
        const liveInfo = await api.getYoutubeLiveInfo(dto.id);
        console.log(liveInfo);

        if (!liveInfo) return;

        if (!liveInfo && !previousLiveInfo) return;

        if (liveInfo.id === "" && previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Youtube, false);
            return;
        }

        if (liveInfo.id !== "" && !previousLiveInfo) {
            ServerRepository.updateStreamLive(guildId, DetectPlatform.Youtube, true);
            this.say(guildId, youtubeLiveInfoMsg(liveInfo));
        }
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

