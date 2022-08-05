import { ObjectId } from "mongodb"

export type ServerInfo = {
    _id?: ObjectId,
    name: string,
    id: string,
    createdDate: Date,
    subscribedStreamer: Array<ObjectId>
    prefix: string,
    status: string
}