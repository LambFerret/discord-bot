import { MessageCommand } from './MessageCommand';
import { CONFIG } from "./config/Config";
import {
  Client, Message, Guild, MessageReaction, User,
  PartialUser, PartialMessageReaction, Role, EmbedBuilder,
  Events, TextChannel} from "discord.js";
import serverService from './service/ServerService';
import { UserType } from './model/UserType';
import { showEntranceInfo } from './MessageFormat';
import { BroadcastInfo } from './model/ServerType';
import SlashCommandService from './service/SlashCommandService';
import { CustomClient } from './service/CustomClient';
import AlarmService from './service/AlarmService';

export default class DiscordBot {

  slashCommandService: SlashCommandService;
  alarmService : AlarmService;
  command: MessageCommand;
  client: Client;

  constructor() {
    this.client = new CustomClient();
    this.slashCommandService = new SlashCommandService(this.client as CustomClient);
    this.alarmService = new AlarmService(this.client);
    this.command = new MessageCommand();

    this.addListeners(this.client);
   }

  addListeners = (client : Client) => {
    client.login(CONFIG.DISCORD_BOT_TOKEN);
    client.once(Events.ClientReady, this.initServers)
    client.on(Events.GuildCreate, (e) => serverService.createServer(e))
    client.on(Events.GuildDelete, (e) => serverService.deleteServer(e.id))
    client.on(Events.MessageCreate, this.clientMessage)
    client.on(Events.MessageReactionAdd, this.handleReactionAdd)
    client.on(Events.InteractionCreate, this.slashCommandService.handleInteraction)
  }

  initServers = async () => {
    console.log("연결")
    this.checkDBAndBotServerMatch();
    const lists = await serverService.getAllServers();
    lists.forEach(server => {
      let serverId = server.id;
      let channelId = server.detectChannel;
      
      console.log(`==== init ${server.name} server ====`);

      console.log("register slash command");
      this.slashCommandService.registerSlashCommand(serverId);

      console.log("detect channel : " + channelId + " | isDetecting : " + server.isDetecting);
      // this.alarmService.checkAlarm(serverId); // test code 
      if (!server.isDeleted && server.isDetecting) this.makeDetectingIntervalByGuild(channelId);

      console.log("=============================");
      
    });
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
    const entranceInfo = await serverService.getEntraceInfo(reaction.message.guildId as string);
    if (!entranceInfo) return;

    if (entranceInfo.role === "") {
      const a: Message = reaction.message as Message;
      const b: User = user as User;
      if (await serverService.getUserInfo(a.guildId as string, b.id) === UserType.Owner) {
        this.say(a, "안녕하세요! \n" + "먼저 <제이름> 입장권한 역할 <역할명> 을 입력해주세요!");
      } else {
        this.say(a, "입장역할이 설정되지 않았습니다. 관리자에게 문의해주세요.");
      }
      return;
    }

    // Check if the message is the specific message and the emoji is the specific emoji
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

  detectNewPost =async (broadcastInfo : BroadcastInfo) => {
    if (broadcastInfo.AfreecaId !== "") {
    }

    if (broadcastInfo.TwitchId !== "") {
    }

    if (broadcastInfo.ChzzkId !== "") {
    }

    if (broadcastInfo.YoutubeId !== "") {
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

  clientMessage = async (msg: Message) => {
    if (!msg.guildId) return;
    if (!await this.command.isStartWithPrefix(msg)) return;

    const userType = await serverService.getUserInfo(msg.guildId as string, msg.author.id)
    let shouldContinue = true;

    console.log("user said : " + msg.content);

    const message = msg.content.split(" ")


    // If the user is an Owner, they can access all functionalities.
    if (userType === UserType.Owner) {
      shouldContinue = await this.ownerMessage(msg, message);

      if (shouldContinue) {
        shouldContinue = await this.botMakerMessage(msg, message);
      }
  
    }

    // If the user is a BotMaker, they can access BotMaker, Moderator and Normal functionalities
    else if (userType === UserType.BotMaker) {
      shouldContinue = await this.botMakerMessage(msg, message);
    }

  }

  ownerMessage = async (msg: Message, message: string[]): Promise<boolean> => {
    // 쟌코봇치야 봇권한 @어쩌구
    if (message[1] === '봇권한') {
      const user = msg.mentions.users.first();
      if (!user) {
        this.say(msg, '유저를 멘션해주세요.');
        return false;
      }
      const response = `${user.displayName}님의 권한이 봇제작자로 변경되었습니다.`;
      this.say(msg, response);
      serverService.updateBotMaker(msg.guildId as string, user.id);
      return false;
    }

    // 쟌코봇치야 관리자 <권한명>
    if (message[1] === '관리자' && message[2]) {

      if (msg.guild?.roles.cache.find(role => role.name === message[2]) === undefined) {
        this.say(msg, `해당 역할이 존재하지 않습니다.`);
        return false;
      }

      const moderators = msg.guild?.members.cache.filter(member => member.roles.cache.find(role => role.name === message[2])).map(member => member.user.id) as string[];
      const response = `역할명 <<${message[2]}>> -> 이 채널의 관리자입니다!`

      serverService.updateModeratorId(msg.guildId as string, moderators);
      this.say(msg, response)
      return false;
    }

    if (message[1] === '입장권한') {
      if (message[2]) {
        if (message[2] === '대사') {
          serverService.updateGuildEntranceQuote(msg.guildId as string, message[3]);
          this.say(msg, `입장대사가 ${message[3]}로 변경되었습니다.`);
          return false;
        } else if (message[2] === '이모지') {
          serverService.updateGuildEntranceEmoji(msg.guildId as string, message[3]);
          this.say(msg, `입장이모지가 ${message[3]}로 변경되었습니다.`);
          return false;
        } else if (message[2] === '역할') {
          if (msg.guild?.roles.cache.find(role => role.name === message[3]) === undefined) {
            this.say(msg, `해당 역할이 존재하지 않습니다.`);
            return false;
          }
          serverService.updateGuildEntranceRole(msg.guildId as string, message[3]);
          this.say(msg, `입장역할이 ${message[3]}로 변경되었습니다.`);
          return false;
        }
      } else {
        const entranceInfo = await serverService.getEntraceInfo(msg.guildId as string);
        this.sayEmbed(msg.channel as TextChannel, showEntranceInfo(entranceInfo));
      }
      return false;
    }
    return true;
  }

  botMakerMessage = async (msg: Message, message: string[]): Promise<boolean> => {

    if (message[1] === '입장권') {
      const entranceInfo = await serverService.getEntraceInfo(msg.guildId as string);
      const a = await this.say(msg, `${entranceInfo.quote}`)
      if (a) {
        serverService.saveEntranceMessageId(msg.guildId as string, a.id);
        a.react(entranceInfo.emoji);

      } else {
        this.say(msg, "갱신 실패! ")
      }


      return false;
    }
    return true;
  }

  say = async (msg: Message, context: string, givenPostfix?: string) => {
    const postfix = givenPostfix ? givenPostfix : await serverService.getGuildPostfix(msg.guildId as string);
    let toSay = "";
    context.split("\n").forEach((line) => {
      toSay += line + " " + postfix + "\n";
    });
    return msg.channel.send(toSay);
  }

  sayEmbed = async (msg: TextChannel, context: any) => {
    const postfix = await serverService.getGuildPostfix(msg.guildId as string);
    const embed = context as EmbedBuilder;
    embed.setFooter({ text: " ..." + postfix })
    console.log(context);

    return msg.send({ embeds: [embed] });
  }
}
