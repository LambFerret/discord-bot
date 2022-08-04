import { ExternalApi } from "./ExternalAPI"
import { StreamerInfoMsg, userNotExistMsg } from "./MessageFormat"

class MessageCommand {
    prefix: string
    isTemp: boolean
    api: ExternalApi
    constructor() {
        this.prefix = '조교쨩'
        this.api = new ExternalApi()
        this.isTemp = true
    }

    isbooleanchange = () => {
        this.isTemp = !this.isTemp
    }
    boolcheck = () => {
        console.log(this.isTemp);

    }
    isStartWithPrefix = (message: string) => {
        if (message.startsWith(this.prefix)) {
            return true
        }
    }

    changePrefix = (message: string) => {
        this.prefix = message
    }

    sendSimpleInfo = () => {
    }

    saveStreamerInfo = () => {
    }

    sendLiveInfo = async (streamer: string) => {
        const streamerInfo = await this.api.getStreamerInfo(streamer);
        const liveInfo = await this.api.getLiveInfo(streamerInfo.broadcaster_login)
        const image = liveInfo.thumbnail_url == undefined ? null : liveInfo.thumbnail_url
        console.log(image);

        return StreamerInfoMsg(streamerInfo, image)
    }

}

export { MessageCommand };