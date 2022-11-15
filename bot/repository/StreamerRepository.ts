import { Collection } from 'mongodb'
import { client } from '../config/MongoConnect'
import { StreamerInfo } from '../model/StreamerType'
export default class StreamerRepository {
    collection: Collection
    constructor() {
        this.collection = client.collection("Streamer")
    }

    createStreamer = async (info: StreamerInfo) => {
        if (info.createdGuild == null) throw new Error("없는 길드")
        const dupDoc = await this.findStreamer(info.createdGuild, info.streamerLogin)
        if (!dupDoc) return this.collection.insertOne(info);
        else throw new Error("중복 문서")
    }


    // deleteStreamer = (guildId: string) => this.collection.deleteOne({ id: guildId })

    findStreamer = async (guildId: string, streamerLogin: string) => await this.collection.findOne({
        createdGuild: guildId,
        streamerLogin: streamerLogin
    })
}

