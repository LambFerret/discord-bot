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

    findSerer = (guildId: string) => this.collection.findOne({ id: guildId })

    updateServer = (guildId: string, streamerId: ObjectId) =>
        this.collection.updateOne(
            { id: guildId },
            {
                $push: {
                    subscribedStreamer: streamerId
                }
            }
        )

}

