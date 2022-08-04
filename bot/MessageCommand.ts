import { ExternalApi } from "./ExternalAPI"
import { streamerLiveInfoMsg, streamerOfflineInfoMsg, userNotExistMsg } from "./MessageFormat"

class MessageCommand {
    prefix: string
    api: ExternalApi
    constructor() {
        this.prefix = '조교쨩'
        this.api = new ExternalApi()
    }

    isStartWithPrefix = (message: string) => {
        if (message.startsWith(this.prefix)) {
            return true
        }
    }

    changePrefix = (message: string) => {
        this.prefix = message
    }

    sendStreamInfo = async (streamer: string) => {
        const streamerInfo = await this.api.getStreamerInfo(streamer);
        if (streamerInfo == undefined || streamerInfo.game_name === '') {
            console.log(streamerInfo);
            return userNotExistMsg()
        }
        const liveInfo = await this.api.getLiveInfo(streamerInfo.broadcaster_login)
        if (!streamerInfo.is_live) return streamerOfflineInfoMsg(streamerInfo)
        return streamerLiveInfoMsg(streamerInfo, liveInfo.thumbnail_url)
    }

}

export { MessageCommand };