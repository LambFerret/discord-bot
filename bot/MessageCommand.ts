import { EmbedBuilder, Guild, Message } from "discord.js"
import { ExternalApi } from "./ExternalAPI"
import {
    streamerLiveInfoMsg, streamerOfflineInfoMsg,
    userNotExistMsg, streamerSaveMsg, introduceBot
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
console.log(liveInfo);

if (liveInfo == null) {
    // Handle the case where liveInfo is null or undefined, maybe log an error or return
    return undefined;
}

if (liveInfo && previousLiveInfo) {
    this.serverService.updateStreamLive(guildId, false);
    return;
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
