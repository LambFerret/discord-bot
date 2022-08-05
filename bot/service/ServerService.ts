import { Guild } from "discord.js";
import { ObjectId } from "mongodb";
import { ServerInfo } from "../model/ServerType";
import ServerRepository from "../repository/ServerRepository";
export default class ServerService {
    serverRepository: ServerRepository;
    constructor() {
        this.serverRepository = new ServerRepository();
    }

    createGuild(info: Guild) {
        const server: ServerInfo = {
            name: info.name,
            id: info.id,
            createdDate: info.joinedAt,
            subscribedStreamer: [],
            prifix: '조교쨩',
            status: 'INIT'
        }
        this.serverRepository.createServer(server);
    }

    deleteGuild(guildId: string) {
        this.serverRepository.deleteServer(guildId);
    }

    addStreamerToGuild(guildId:string|null, streamerId:ObjectId) {
        if (guildId==null) return;
        this.serverRepository.updateServer(guildId, streamerId)
    }

}