export type ServerInfo = {
    name: string,
    id: string,
    createdDate: Date,
    OwnerId: string,
    detectChannel: string,
    postfix: string,
    status: string,
    entrance: Entrance,
    isDeleted: boolean,
    broadcastInfo: BroadcastInfo,
    streamingStatus: StreamingStatus,
    serverDetectInfos: ServerDetectInfos,
    lastCommunityPostIDs: LastCommunityPostIDs,
    settings : Settings,
}

export type Entrance = {
    entranceChannelId: string,
    quote: string,
    messageId: string,
    emoji: string,
    role: string,
}

export type BroadcastInfo = {
    AfreecaId: string,
    TwitchId: string,
    ChzzkId: string,
    YoutubeId: string,
}

export type StreamingStatus = {
    isTwitchStreamLive: boolean,
    isAfreecaStreamLive: boolean,
    isChzzkStreamLive: boolean,
    isYoutubeStreamLive: boolean,
}

export type ServerDetectInfos = {
    broadcastDetect: {
        twitch: boolean,
        afreeca: boolean,
        chzzk: boolean,
        youtube: boolean,
    },
    newPostDetect: {
        afreeca: boolean,
        chzzk: boolean,
        youtube: boolean,
    },
    ownerChatDetect: {
        afreeca: boolean,
        chzzk: boolean,
        youtube: boolean,
    },
    elseDetect: {
        naverCafe: boolean,
    },
}

export type LastCommunityPostIDs = {
    twitchPostId: string[],
    afreecaPostId: string[],
    chzzkPostId: string[],
    youtubePostId: string[],
}

export type LiveInfoDTO = {
    id: string | undefined,
    isLive: boolean,
}

export type Settings = {
    afreecaNewPostOnlyAnnouncement: string,
    newPostIncludeEveryone: boolean,
    LiveIncludeEveryone: boolean,
}