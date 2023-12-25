import { EmbedBuilder, Guild, Message } from "discord.js"
import { ExternalApi, StreamType } from "./ExternalAPI"
import {
    streamerLiveInfoMsg, introduceBot, streamerLiveInfoMsgAfreeca
} from "./MessageFormat"
import ServerService from "./service/ServerService"
import { CONFIG } from "./config/Config"


class MessageCommand {
    api: ExternalApi
    serverService: ServerService
    constructor() {
        this.api = new ExternalApi()
        this.serverService = new ServerService()
    }

    isStartWithPrefix = async (message: Message) => {
        if (!message.guildId) return false
        const msg = message.content
        let prefix = ''
        try {
            prefix = await this.serverService.getGuildPrefix(message.guildId);
        } catch (err) {
            prefix = (await this.serverService.createGuild(message.guild as Guild)).prefix
        }
        if (msg.startsWith(prefix) && !message.author.bot && prefix != '') {
            return true
        } else {
            return false
        }
    }

    sendTwitchStreamInfo = async (guildId: string): Promise<EmbedBuilder | undefined> => {
        const previousLiveInfo = await this.serverService.getStreamLiveInfo(guildId, StreamType.Twitch);
        const liveInfo = await this.api.getTwitchLiveInfo(CONFIG.TWITCH_STREAMER_ID);

        if (!liveInfo && !previousLiveInfo) return undefined;

        if (!liveInfo && previousLiveInfo) {
            this.serverService.updateStreamLive(guildId, StreamType.Twitch, false);
            return undefined;
        }

        if (liveInfo.type === 'live' && !previousLiveInfo) {
            this.serverService.updateStreamLive(guildId, StreamType.Twitch, true);
            return streamerLiveInfoMsg(liveInfo);
        }

        return undefined;
    }

    sendAfreecaStreamInfo = async (guildId: string): Promise<EmbedBuilder | undefined> => {
        const afreecaLiveInfo = await this.api.getAfreecaLiveInfo(CONFIG.AFREECA_STREAMER_ID);
        const previousLiveInfo = await this.serverService.getStreamLiveInfo(guildId, StreamType.Afreeca);

        if (!afreecaLiveInfo && !previousLiveInfo) return undefined;

        if (!afreecaLiveInfo && previousLiveInfo) {
            this.serverService.updateStreamLive(guildId, StreamType.Afreeca, false);
            return undefined;
        }

        if (afreecaLiveInfo.isLive && !previousLiveInfo) {
            this.serverService.updateStreamLive(guildId, StreamType.Afreeca, true);
            return streamerLiveInfoMsgAfreeca(afreecaLiveInfo);
        }

        return undefined;

    }

    introduceBot = (name: string, myName: string) => introduceBot(name, myName)

}

export { MessageCommand };
