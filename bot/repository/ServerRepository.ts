import { Collection } from 'mongodb'
import { client } from '../config/MongoConnect'
import { ServerInfo } from '../model/ServerType'
export default class ServerRepository {
    collection: Collection
    constructor() {
        this.collection = client.collection("Server")
    }

    createServerInfo = (info: ServerInfo) => {
        this.collection.insertOne(info);
    }



}

