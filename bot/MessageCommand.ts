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
        const previousLiveInfo = await this.serverService.getStreamLiveInfo(guildId)
        if (previousLiveInfo == null) return undefined;
        const streamerInfo = await this.api.getStreamerInfo(streamer);
        console.log(streamerInfo);
        if (streamerInfo == undefined) {
            console.log("user not exist");
            return;
        }
        const liveInfo = await this.api.getLiveInfo(streamerInfo.broadcaster_login)
        console.log(liveInfo);

        if (previousLiveInfo !== streamerInfo.is_live && streamerInfo.is_live) {
            this.serverService.updateStreamLive(guildId, streamerInfo.is_live)
            return streamerLiveInfoMsg(streamerInfo, liveInfo.thumbnail_url)
        } else {
            this.serverService.updateStreamLive(guildId, streamerInfo.is_live)
            return;
        }
    }

    introduceBot = (name: string, myName: string) => introduceBot(name, myName)

}

export { MessageCommand };