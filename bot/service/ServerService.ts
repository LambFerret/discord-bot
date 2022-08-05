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
            prefix: '조교쨩',
            status: 'INIT'
        }
        this.serverRepository.createServer(server);
    }

    deleteGuild(guildId: string) {
        this.serverRepository.deleteServer(guildId);
    }

    async findGuild(guildId: string) {
        return await this.serverRepository.findServer(guildId) as ServerInfo
    }

    updateGuildPrefix(guildId:string, prefix:string) {
        this.serverRepository.updateServerPrefix(guildId, prefix)
    }

    addStreamerToGuild(guildId:string|null, streamerId:ObjectId) {
        if (guildId==null) return;
        this.serverRepository.updateServerStreamer(guildId, streamerId, true)
    }
    
    popStreamerFromGuild(guildId:string|null, streamerId:ObjectId) {
        if (guildId==null) return;
        this.serverRepository.updateServerStreamer(guildId, streamerId, false)
    }

}