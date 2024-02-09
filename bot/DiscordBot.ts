import {
  Client, Events, Guild, MessageReaction, PartialMessageReaction,
  PartialUser, Role, User
} from "discord.js";
import { CONFIG } from "./config/Config";
import { CustomClient } from './config/CustomClient';
import { introduceBotWithDM } from './MessageFormat';
import { ServerInfo } from './model/ServerType';
import AlarmService from './service/AlarmService';
import PostService from './service/PostService';
import serverService from './service/ServerService';
import SlashCommandService from './service/SlashCommandService';

export default class DiscordBot {

  slashCommandService: SlashCommandService;
  alarmService: AlarmService;
  postService: PostService;
  client: Client;

  constructor() {
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
    // this.readyEachServer(server);
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
    await this.checkDBAndBotServerMatch();
    const lists = await serverService.getAllServers();
    lists.forEach(server => {
      this.readyEachServer(server);
    });
  }

  test = async () => {

  }

  readyEachServer = async (server: ServerInfo) => {
    let serverId = server.id;

    console.log(`==== init ${server.name} server ====`);

    console.log("register slash command");
    this.slashCommandService.registerSlashCommand(serverId);

    // =-=-=-=-=-=- test =-=-=-=-=-=-=
    this.alarmService.makeCron(serverId);
    this.postService.makeCron(serverId);
    this.test();
    const guild = this.client.guilds.cache.get(serverId) as Guild;
    // this.createServer(guild);
    // =-=-=-=-=-=- test =-=-=-=-=-=-=
    console.log("=============================");
  }


  checkDBAndBotServerMatch = async () => {
    const botGuilds = this.client.guilds.cache.map(guild => guild.id);
    const dbGuilds = await serverService.getAllGuildId();

    dbGuilds.forEach(async (guildId) => {
      if (!botGuilds.includes(guildId)) {
        serverService.deleteServer(guildId);
      }
    })

    botGuilds.forEach(async (guildId) => {
      if (!dbGuilds.includes(guildId)) {
        const guild = this.client.guilds.cache.get(guildId) as Guild;
        serverService.createServer(guild);
      }
    })
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
