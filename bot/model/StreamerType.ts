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
    youtube?: string,
    twitch: string,
    instagram?: string,
    thumbnail?: string,
}