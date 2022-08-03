import { Collection } from "mongodb";
import { StreamerInfo } from "../model/StreamerType";
import { MongoClient } from "mongodb";
import { CONFIG } from "./Config";
const uri = CONFIG.mongo as string;
const client = new MongoClient(uri);

const saveStreamer = (StreamerName: string) => {
    const collection = client.db("test").collection("Streamer") as Collection;
    console.log("mongo connected");
    const info: StreamerInfo = {
        streamerName: 'ㅎㅎ',
        streamerNowPlaying: 'ㅎㅎ',
        isStream: false,
        createdUser: 'ㅎㅎ',
        createChannel: 'g',
        createdDate: new Date(),
        modifiedDate: new Date(),
        url: {
            youtube: 'string',
            twitch: 'string',
            instagram: 'string',
            thumbnail: 'string',
        }
        ,
        isConfirmed: false
    }


    collection.insertOne(info)

}

module.exports = {
    saveStreamer
}
