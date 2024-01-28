export type ServerInfo = {
    name: string,
    id: string,
    createdDate: Date,
    OwnerId: string,
    detectChannel : string,
    MyId: string,
    ModeratorId: Array<string>,
    prefix: string,
    postfix: string,
    status: string,
    entrance : Entrance,
    isTwitchStreamLive : boolean,
    isAfreecaStreamLive : boolean,
    isDetecting : boolean,
    isDeleted : boolean,
    broadcastInfo : BroadcastInfo,
}

export type Entrance = {
    quote : string,
    messageId : string,
    emoji : string,
    role: string,
}

export type BroadcastInfo = {
    AfreecaId : string,
    TwitchId : string,
    ChzzkId : string,
    YoutubeId : string,
}