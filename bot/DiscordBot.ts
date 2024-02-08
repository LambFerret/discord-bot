import {
  Client, EmbedBuilder,
  Events, Guild, Message, MessageReaction, PartialMessageReaction,
  PartialUser, Role, TextChannel, User
} from "discord.js";
import { CONFIG } from "./config/Config";
import { CustomClient } from './config/CustomClient';
import { MessageCommand } from './MessageCommand';
import { showEntranceInfo } from './MessageFormat';
import { BroadcastInfo } from './model/ServerType';
import AlarmService from './service/AlarmService';
import PostService from './service/PostService';
import serverService from './service/ServerService';
import SlashCommandService from './service/SlashCommandService';

export default class DiscordBot {

  slashCommandService: SlashCommandService;
  alarmService: AlarmService;
  postService: PostService;
  command: MessageCommand;
  client: Client;

  constructor() {
    this.client = new CustomClient();
    this.slashCommandService = new SlashCommandService(this.client as CustomClient);
    this.alarmService = new AlarmService(this.client);
    this.postService = new PostService(this.client);
    this.command = new MessageCommand();

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
    serverService.createServer(guild);
    // DM to guild owner 
    const owner = await guild.fetchOwner();
    const dm = await owner.createDM();
    const embed = new EmbedBuilder()
      .setTitle("안녕하세요! 봇을 추가해주셔서 감사합니다.")
      .setDescription("봇을 사용하기 위해서는 몇가지 설정이 필요합니다. \n" +
        "방송 알림을 보낼 채널을 설정해야 합니다. \`/알림채널등록\` 으로 등록해주세요.  \n" +
        "추가로 새 친구가 입장시 서버의 권한을 설정해 줄 수 있습니다. 입장채널을 설정하려면 \`/입장채널등록\` 으로 등록해주세요 \n" +
        "알림 채널을 등록했다면, 제게 주인님의 정보를 알려줘야겠죠? \`/등록\`으로 정보를 입력해주세요! \n" +
        "모든 감지는 주인님이 켜고 끌 수 있습니다! 초기설정은 off이므로 \`/감지\`를 통해 원하는 기능을 on 해주세요! \n" +
        "더욱 자세한 설명서는 현재 제작중에 있습니다! \`/\`를 누르시고 한번 둘러보세요! \n")

    dm.send({ embeds: [embed] });
  }

  initServers = async () => {
    console.log("연결")
    this.checkDBAndBotServerMatch();
    const lists = await serverService.getAllServers();
    lists.forEach(server => {
      let serverId = server.id;

      console.log(`==== init ${server.name} server ====`);

      console.log("register slash command");
      this.slashCommandService.registerSlashCommand(serverId);

      // =-=-=-=-=-=- test =-=-=-=-=-=-=
      this.alarmService.makeCron(serverId);
      this.postService.makeCron(serverId);
      this.test();
      // =-=-=-=-=-=- test =-=-=-=-=-=-=
      console.log("=============================");

    });
  }
  test = async () => {

  }

  checkDBAndBotServerMatch = async () => {
    const botGuilds = this.client.guilds.cache.map(guild => guild.id);
    const dbGuilds = await serverService.getAllGuildId();

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

    if (entranceInfo.role === "") {
      const a: Message = reaction.message as Message;
      this.sayEmbed(a.channel as TextChannel, showEntranceInfo(entranceInfo));
      return;
    }

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

  makeDetectingIntervalByGuild = (channelId: string) => {
    const chan = this.client.channels.cache.get(channelId) as TextChannel
    console.log("makeInterval when init ");
    this.searchStreamer(chan);
    this.searchStreamerAfreeca(chan);
    setInterval(() => this.searchStreamer(chan), 60000);
    setInterval(() => this.searchStreamerAfreeca(chan), 60000);
  }

  makeInterval = (msg: Message) => {
    console.log("makeInterval start");
    this.searchStreamer(msg.channel as TextChannel);
    this.searchStreamerAfreeca(msg.channel as TextChannel);

    setInterval(() => this.searchStreamer(msg.channel as TextChannel), 60000)
    setInterval(() => this.searchStreamerAfreeca(msg.channel as TextChannel), 60000)
  }

  searchStreamer = async (chan: TextChannel) => {
    const guildId = chan.guild.id;
    const a = await this.command.sendTwitchStreamInfo(guildId)
    if (a !== undefined) {
      this.sayEmbed(chan, a)
    }
  }

  searchStreamerAfreeca = async (chan: TextChannel) => {
    console.log("interval in this channel : " + chan.guild.name + " date : " + Date.now());
    const guildId = chan.guild.id;
    const a = await this.command.sendAfreecaStreamInfo(guildId)
    if (a !== undefined) {
      this.sayEmbed(chan, a)
    } else {
      console.log(Date.now() + "Streamer offline");
    }
  }

  sayEmbed = async (msg: TextChannel, context: any) => {
    const postfix = await serverService.getGuildPostfix(msg.guildId as string);
    const embed = context as EmbedBuilder;
    embed.setFooter({ text: " ..." + postfix })
    console.log(context);
    return msg.send({ embeds: [embed] });
  }
}
