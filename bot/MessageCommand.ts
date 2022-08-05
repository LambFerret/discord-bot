import { Guild, Message } from "discord.js"
import { ObjectId } from "mongodb"
import { ExternalApi } from "./ExternalAPI"
import { 
    streamerLiveInfoMsg, streamerOfflineInfoMsg, 
    userNotExistMsg, streamerSaveMsg
} from "./MessageFormat"
import { StreamerInfo } from "./model/StreamerType"
import ServerService from "./service/ServerService"
import StreamerService from "./service/StreamerService"

class MessageCommand {
    prefix: string
    api: ExternalApi
    streamerService: StreamerService
    serverService: ServerService
    constructor() {
        this.prefix = '조교쨩'
        this.api = new ExternalApi()
        this.streamerService = new StreamerService()
        this.serverService = new ServerService()
    }

    isStartWithPrefix = (message: string) => {
        if (message.startsWith(this.prefix)) {
            return true
        }
    }

    changePrefix = (message: string) => {
        this.prefix = message
    }

    saveStreamerInfo = async (streamer: string, msg: Message) => {
        const streamerInfo = await this.api.getStreamerInfo(streamer);
        // console.log(streamerInfo);
        if (streamerInfo == undefined) {
            return userNotExistMsg()
        }
        const doc = await this.streamerService.saveStreamer(streamerInfo, msg)
        this.serverService.addStreamerToGuild(msg.guildId, doc.insertedId)
        return streamerSaveMsg(streamerInfo.display_name)

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

}

export { MessageCommand };