export type StreamerInfo = {
    streamerName: string,
    streamerNowPlaying?:string,
    isStream: boolean,
    createChannel: string,
    createdUser: string,
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