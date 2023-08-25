import { Guild, Message } from "discord.js"
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

    sendStreamInfo = async (streamer: string) => {
        const streamerInfo = await this.api.getStreamerInfo(streamer);
        console.log(streamerInfo);
        if (streamerInfo == undefined) {
            return userNotExistMsg()
        }
        const liveInfo = await this.api.getLiveInfo(streamerInfo.broadcaster_login)
        console.log(liveInfo);

        if (!streamerInfo.is_live) return streamerOfflineInfoMsg(streamerInfo)
        return streamerLiveInfoMsg(streamerInfo, liveInfo.thumbnail_url)
    }

    introduceBot = (name: string, myName :string) => introduceBot(name, myName)
    


}

export { MessageCommand };