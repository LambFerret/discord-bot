export type ServerInfo = {
    name: string,
    id: string,
    createdDate: Date,
    OwnerId: string,
    MyId: string,
    ModeratorId: Array<string>,
    prefix: string,
    postfix: string,
    status: string,
    entrance : Entrance,
}

export type Entrance = {
    quote : string,
    messageId : string,
    emoji : string,
    role: string,
}