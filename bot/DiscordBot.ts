import {
  Client, Events, Guild, MessageReaction, PartialMessageReaction,
  PartialUser, Role, User
} from "discord.js";
import { CONFIG } from "./config/Config";
import { CustomClient } from './config/CustomClient';
import { introduceBotWithDM } from './MessageFormat';
import { ServerInfo } from './model/ServerType';
import ServerRepository from "./repository/ServerRepository";
import AlarmService from './service/AlarmService';
import PostService from './service/PostService';
import serverService from './service/ServerService';
import SlashCommandService from './service/SlashCommandService';
import MongoConnect from "./config/MongoConnect";

export default class DiscordBot {

  slashCommandService: SlashCommandService;
  alarmService: AlarmService;
  postService: PostService;
  client: Client;
  mongo: MongoConnect;

  constructor() {
    this.mongo = MongoConnect.getInstance();
    this.client = new CustomClient();
    this.slashCommandService = new SlashCommandService(this.client as CustomClient);
    this.alarmService = new AlarmService(this.client);
    this.postService = new PostService(this.client);
    this.addListeners(this.client);
  }

  addListeners = (client: Client) => {
    client.login(CONFIG.DISCORD_BOT_TOKEN);
    client.once(Events.ClientReady, this.initServers)
    client.on(Events.GuildCreate, this.createServer)
    client.on(Events.GuildDelete, (e) => serverService.deleteServer(e.id))
    client.on(Events.MessageReactionAdd, this.handleReactionAdd)
    client.on(Events.InteractionCreate, this.slashCommandService.handleInteraction)
  }

  createServer = async (guild: Guild) => {
    const server = await serverService.createServer(guild);
    // DM to guild owner 
    const owner = await guild.fetchOwner();
    introduceBotWithDM(owner);
    this.readyEachServer(server.id);
  }

  initServers = async () => {
    const title = `
                                                                   
,--.  ,--.  ,-----.  ,--.   ,--. ,--.   ,--. ,------. ,------. 
|  '--'  | '  .-.  ' |  |   |  | |   \`.'   | |  .---' |  .---' 
|  .--.  | |  | |  | |  |.'.|  | |  |'.'|  | |  \`--,  |  \`--,  
|  |  |  | '  '-'  ' |   ,'.   | |  |   |  | |  \`---. |  \`---. 
\`--'  \`--'  \`-----'  '--'   '--' \`--'   \`--' \`------' \`------' 
                                                               
    `
    console.log(title)

    this.client.guilds.cache.forEach(guild => {
      this.readyEachServer(guild.id);
    });
  }

  test = async (serverId: string) => {
  }

  readyEachServer = async (serverId: string) => {

    console.log(`==== init ${serverId} server ====`);

    if (!(await serverService.isServerExist(serverId))) {
      console.log("server not exist");
      await this.createServer(this.client.guilds.cache.get(serverId) as Guild);
    }

    // =-=-=-=-=-=- prod =-=-=-=-=-=-=
    console.log("register slash command");
    this.slashCommandService.registerSlashCommand(serverId);
    this.alarmService.makeCron(serverId);
    this.postService.makeCron(serverId);
    // =-=-=-=-=-=- prod =-=-=-=-=-=-=

    // =-=-=-=-=-=- test =-=-=-=-=-=-=
    // this.test(serverId);
    // =-=-=-=-=-=- test =-=-=-=-=-=-=
    console.log("=============================");
  }


  checkDBAndBotServerMatch = async () => {
    /*
    const guildsInBotCache = this.client.guilds.cache.map(guild => guild.id);
    const GuildsInDB = await serverService.getAllServers();

    // 데이터베이스에는 있지만 봇 캐시에 없는 서버 삭제
    for (const guild of GuildsInDB) {
      const guildIdInDB = guild.id;
      if (!guildsInBotCache.includes(guildIdInDB)) {
        await serverService.deleteServer(guildIdInDB);
      }
    }

    for (const guildId of guildsInBotCache) {
      if (!GuildsInDB.find(server => server.id === guildId)) {
        const exists = await ServerRepository.checkGuildExists(guildId);
        if (!exists) {
          const guild = this.client.guilds.cache.get(guildId);
          if (guild) await serverService.createServer(guild);
        }
      }
    }
    */
  }

  handleReactionAdd = async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();
    const entranceInfo = await serverService.getEntranceInfo(reaction.message.guildId as string);
    if (!entranceInfo) return;

    const targetMessageId = entranceInfo.messageId;
    const targetEmoji = entranceInfo.emoji;

    if (reaction.message.id === targetMessageId && reaction.emoji.name === targetEmoji) {
      const guild = reaction.message.guild;
      if (!guild) return;

      // Get the member from the guild
      const member = await guild.members.fetch(user.id);
      if (!member) return;

      // Find the role
      const role = guild.roles.cache.find((role: Role) => role.name === entranceInfo.role);
      if (!role) return;

      // Add the role to the member
      await member.roles.add(role);
    }
  }
}
