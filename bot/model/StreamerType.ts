import { ObjectId } from "mongodb"

export type StreamerInfo = {
    _id?: ObjectId,
    streamerLogin: string,
    streamerName: string,
    streamerNowPlaying?: string,
    isStream: boolean,
    createdGuild: string | null,
    createdUserId: string,
    createdUserName: string,
    createdDate: Date,
    modifiedDate: Date,
    url: UrlString,
    isConfirmed: boolean
}

export type UrlString = {
    twitch: string,
    youtube?: string,
    instagram?: string,
    thumbnail?: string,
}