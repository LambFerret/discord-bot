import { EmbedBuilder, Guild, Message } from "discord.js"
import {
    twitchLiveInfoMsg, introduceBot, afreecaLiveInfoMsg
} from "./MessageFormat"
import serverService from "./service/ServerService"
import { CONFIG } from "./config/Config"
import { DetectPlatform } from "./model/DetectType"
import api from "./ExternalAPI"


class MessageCommand {

    isStartWithPrefix = async (message: Message) => {
        if (!message.guildId) return false
        const msg = message.content
        let prefix = ''
        try {
            prefix = await serverService.getGuildPrefix(message.guildId);
        } catch (err) {
            // prefix = (await serverService.createServer(message.guild as Guild)).prefix
        }
        if (msg.startsWith(prefix) && !message.author.bot && prefix != '') {
            return true
        } else {
            return false
        }
    }

    sendTwitchStreamInfo = async (guildId: string): Promise<EmbedBuilder | undefined> => {
        const dto = await serverService.getStreamLiveInfo(guildId, DetectPlatform.Twitch);
        if (dto.id === undefined) return undefined;
        const previousLiveInfo = dto.isLive;
        const liveInfo = await api.getTwitchLiveInfo(dto.id);

        if (!liveInfo && !previousLiveInfo) return undefined;

        if (!liveInfo && previousLiveInfo) {
            serverService.updateStreamLive(guildId, DetectPlatform.Twitch, false);
            return undefined;
        }

        if (liveInfo.type === 'live' && !previousLiveInfo) {
            serverService.updateStreamLive(guildId, DetectPlatform.Twitch, true);
            return twitchLiveInfoMsg(liveInfo);
        }

        return undefined;
    }

    sendAfreecaStreamInfo = async (guildId: string): Promise<EmbedBuilder | undefined> => {
        const dto = await serverService.getStreamLiveInfo(guildId, DetectPlatform.Afreeca);
        if (dto.id === undefined) return undefined;
        const previousLiveInfo = dto.isLive;
        const afreecaLiveInfo = await api.getAfreecaLiveInfo(dto.id);

        if (!afreecaLiveInfo && !previousLiveInfo) return undefined;

        if (!afreecaLiveInfo && previousLiveInfo) {
            serverService.updateStreamLive(guildId, DetectPlatform.Afreeca, false);
            return undefined;
        }

        if (!afreecaLiveInfo.isLive && previousLiveInfo) {
            serverService.updateStreamLive(guildId, DetectPlatform.Afreeca, false);
            return undefined;
        }
        if (afreecaLiveInfo.isLive && !previousLiveInfo) {
            serverService.updateStreamLive(guildId, DetectPlatform.Afreeca, true);
            return afreecaLiveInfoMsg(afreecaLiveInfo);
        }
        return undefined;
    }
}

export { MessageCommand };
