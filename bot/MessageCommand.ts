import { EmbedBuilder, Message } from "discord.js"
import api from "./ExternalAPI"
import { afreecaLiveInfoMsg, twitchLiveInfoMsg } from "./MessageFormat"
import { DetectPlatform } from "./model/DetectType"
import serverService from "./service/ServerService"


class MessageCommand {
    sendTwitchStreamInfo = async (guildId: string): Promise<EmbedBuilder | undefined> => {
        const dto = await serverService.getStreamLiveInfo(guildId, DetectPlatform.Twitch);
        if (dto.id === undefined) return undefined;
        const previousLiveInfo = dto.isLive;
        const liveInfo = await api.getTwitchLiveInfo(dto.id);

        if (!liveInfo) return undefined;
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

        if (!afreecaLiveInfo) return undefined;

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

export { MessageCommand }

