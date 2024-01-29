import { EmbedBuilder, Guild, Message } from "discord.js"
import { ExternalApi, StreamType } from "./ExternalAPI"
import {
    streamerLiveInfoMsg, introduceBot, streamerLiveInfoMsgAfreeca
} from "./MessageFormat"
import serverService from "./service/ServerService"
import { CONFIG } from "./config/Config"


class MessageCommand {
    api: ExternalApi
    constructor() {
        this.api = new ExternalApi()
    }

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
        const previousLiveInfo = await serverService.getStreamLiveInfo(guildId, StreamType.Twitch);
        const liveInfo = await this.api.getTwitchLiveInfo(CONFIG.TWITCH_STREAMER_ID);

        if (!liveInfo && !previousLiveInfo) return undefined;

        if (!liveInfo && previousLiveInfo) {
            serverService.updateStreamLive(guildId, StreamType.Twitch, false);
            return undefined;
        }

        if (liveInfo.type === 'live' && !previousLiveInfo) {
            serverService.updateStreamLive(guildId, StreamType.Twitch, true);
            return streamerLiveInfoMsg(liveInfo);
        }

        return undefined;
    }

    sendAfreecaStreamInfo = async (guildId: string): Promise<EmbedBuilder | undefined> => {
        const afreecaLiveInfo = await this.api.getAfreecaLiveInfo(CONFIG.AFREECA_STREAMER_ID);
        const previousLiveInfo = await serverService.getStreamLiveInfo(guildId, StreamType.Afreeca);

        if (!afreecaLiveInfo && !previousLiveInfo) return undefined;

        if (!afreecaLiveInfo && previousLiveInfo) {
            serverService.updateStreamLive(guildId, StreamType.Afreeca, false);
            return undefined;
        }

        if (!afreecaLiveInfo.isLive && previousLiveInfo) {
            serverService.updateStreamLive(guildId, StreamType.Afreeca, false);
            return undefined;
	}
        if (afreecaLiveInfo.isLive && !previousLiveInfo) {
            serverService.updateStreamLive(guildId, StreamType.Afreeca, true);
            return streamerLiveInfoMsgAfreeca(afreecaLiveInfo);
        }

        return undefined;

    }

    introduceBot = (name: string, myName: string) => introduceBot(name, myName)

}

export { MessageCommand };
