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
        this.prefix = ""
        this.api = new ExternalApi()
        this.streamerService = new StreamerService()
        this.serverService = new ServerService()
    }

    isStartWithPrefix = async (message: Message) => {
        if (!message.guildId) return false
        const msg = message.content
        this.prefix = (await this.serverService.findGuild(message.guildId)).prefix
        if (msg.startsWith(this.prefix)) {
            return true
        } else {
            return false
        }
    }

    changePrefix = (guildId: string | null, message: string) => {
        if (guildId == null) return;
        this.prefix = message
        this.serverService.updateGuildPrefix(guildId, message)
    }

    saveStreamerInfo = async (streamer: string, msg: Message) => {
        const streamerInfo = await this.api.getStreamerInfo(streamer);
        console.log(streamerInfo);
        if (streamerInfo == undefined) {
            return userNotExistMsg()
        }
        const doc = await this.streamerService.saveStreamer(streamerInfo, msg)
        this.serverService.addStreamerToGuild(msg.guildId, doc.insertedId)
        return streamerSaveMsg(streamerInfo.display_name)
    }

    deleteStreamerInfo = async (streamer: string, msg: Message) => {
        const findId = new ObjectId()
        this.serverService.popStreamerFromGuild(msg.guildId, findId)
        return userNotExistMsg() // TODO : 삭제시 메세지
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