import { EmbedBuilder, Guild, Message } from "discord.js"
import { ExternalApi } from "./ExternalAPI"
import {
    streamerLiveInfoMsg, introduceBot
} from "./MessageFormat"
import ServerService from "./service/ServerService"


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
    sendStreamInfo = async (guildId: string, streamer: string): Promise<EmbedBuilder | undefined> => {
        const previousLiveInfo = await this.serverService.getStreamLiveInfo(guildId);
        if (previousLiveInfo == null) return undefined;

        const liveInfo = await this.api.getLiveInfo(streamer);
        console.log('-=-=-=-=-= streamer : ' + streamer);
        console.log(liveInfo);
        console.log('=-=-=-=-=-==-=-=-=-=-==-=-=-=-=-==-=-=-=-=-=')

        if (liveInfo == null && previousLiveInfo) {
            this.serverService.updateStreamLive(guildId, false);
            return undefined;
        }

        if (liveInfo.type === 'live' && !previousLiveInfo) {
            this.serverService.updateStreamLive(guildId, true);
            return streamerLiveInfoMsg(liveInfo);
        } else {
            return undefined;
        }
    }
    introduceBot = (name: string, myName: string) => introduceBot(name, myName)

}

export { MessageCommand };
