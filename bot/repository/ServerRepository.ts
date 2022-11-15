import { Collection, ObjectId } from 'mongodb'
import { client } from '../config/MongoConnect'
import { ServerInfo } from '../model/ServerType'
export default class ServerRepository {
    collection: Collection
    constructor() {
        this.collection = client.collection("Server")
    }

    createServer = (info: ServerInfo) => this.collection.insertOne(info);

    deleteServer = (guildId: string) => this.collection.deleteOne({ id: guildId })

    findServer = (guildId: string) => this.collection.findOne({ id: guildId })

    updateServerPrefix = (guildId: string, prefix: string) =>
        this.collection.updateOne(
            { id: guildId },
            {
                $set: {
                    prefix: prefix
                }
            }
        )

    updateServerStreamer = (guildId: string, streamerId: ObjectId, isPush: boolean) => {
        const update = isPush
            ?
            {
                $push: {
                    subscribedStreamer: streamerId
                }
            }
            :
            {
                $pull: {
                    subscribedStreamer: streamerId
                }
            }

        return this.collection.updateOne({ id: guildId }, update)
    }
}

