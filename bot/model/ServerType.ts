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
    isDetecting : boolean,
    isDeleted : boolean,
    broadcastInfo : BroadcastInfo,
    streamingStatus : StreamingStatus,
    serverDetectInfos : ServerDetectInfos,
    lastCommunityPostIDs : LastCommunityPostIDs,
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

export type StreamingStatus = {
    isTwitchStreamLive : boolean,
    isAfreecaStreamLive : boolean,
    isChzzkStreamLive : boolean,
    isYoutubeStreamLive : boolean,
}

export type ServerDetectInfos = {
    broadcastDetect : {
        twitch : boolean,
        afreeca : boolean,
        chzzk : boolean,
        youtube : boolean,
    },
    newPostDetect : {
        afreeca : boolean,
        chzzk : boolean,
        youtube : boolean,
    },
    ownerChatDetect : {
        afreeca : boolean,
        chzzk : boolean,
        youtube : boolean,
    },
    elseDetect : {
        naverCafe : boolean,
    },
}

export type LastCommunityPostIDs = {
    twitchPostId : string,
    afreecaPostId : string,
    chzzkPostId : string,
    youtubePostId : string,
}