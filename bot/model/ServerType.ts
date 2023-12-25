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
}

export type Entrance = {
    quote : string,
    messageId : string,
    emoji : string,
    role: string,
}