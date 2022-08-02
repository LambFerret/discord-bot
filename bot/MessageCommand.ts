import { ExternalApi } from "./ExternalAPI"
import { embededMsg, offlineMsg } from "./MessageFormat"

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

    sendSimpleInfo = () => {

    }

    saveStreamerInfo = () => {


    }
    temp = () => {console.log("test");
    }
    sendLiveInfo = async (streamer:string) => {
        const info = await this.api.getLiveInfo(streamer);
        if (info == undefined) {
            return offlineMsg()
        } else {
            return embededMsg(info)
        }
    }

}

export { MessageCommand };