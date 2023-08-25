import { Guild, Message } from "discord.js";
import { LiveStreamerInfoType } from "../model/LiveStreamerInfoType";
import { StreamerInfo } from "../model/StreamerType";
// import StreamerRepository from "../repository/StreamerRepository";

export default class StreamerService {
    // streamerRepository: StreamerRepository;
    // constructor() {
    //     this.streamerRepository = new StreamerRepository();
    // }

    saveStreamer = async (info: LiveStreamerInfoType, msg: Message) => {
        const url = {
            twitch: "https://twitch.tv/" + info.broadcaster_login,
            thumbnail: info.thumbnail_url
        }
        const saveInfo: StreamerInfo = {
            streamerName: info.display_name,
            streamerLogin: info.broadcaster_login,
            isStream: info.is_live,
            createdGuild: msg.guildId,
            createdUserId: msg.author.id,
            createdUserName: msg.author.username,
            createdDate: new Date(),
            modifiedDate: new Date(),
            url: url,
            isConfirmed: false
        }
        if (info.is_live) saveInfo.streamerNowPlaying = info.game_name;
        // return await this.streamerRepository.createStreamer(saveInfo)
    }
}