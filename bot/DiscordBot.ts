import { MessageCommand } from './MessageCommand';
import { CONFIG } from "./config/Config";
import * as os from 'os';
import { Client, Message, GatewayIntentBits, Guild, MessageReaction, User, PartialUser, PartialMessageReaction, Role, Partials, ActivityType, EmbedBuilder } from "discord.js";
import ServerService from './service/ServerService';
import StreamerService from './service/StreamerService';
import { UserType } from './model/UserType';
import { Entrance } from './model/ServerType';
import { showEntranceInfo } from './MessageFormat';
import { ExternalApi } from './ExternalAPI';

export default class DiscordBot {

  serverService: ServerService;
  streamerService: StreamerService;
  command: MessageCommand;
  client: Client;

  constructor() {
    this.streamerService = new StreamerService();
    this.serverService = new ServerService();
    this.command = new MessageCommand();
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions],
      partials: [Partials.Message, Partials.Reaction, Partials.User],
      presence: {
        activities: [{ name: '쟌코봇설명서 ', type: ActivityType.Listening }],
        status: 'online'
      }
    });
    this.client.login(CONFIG.DISCORD_BOT_TOKEN);
    this.client.once('ready', this.botReady)
    this.client.on('guildCreate', this.clientInit)
    // this.client.on('guildDelete', this.serverClosed)
    this.client.on('messageCreate', this.clientMessage)
    this.client.on('messageReactionAdd', this.handleReactionAdd)
  }

  clientInit = (info: Guild) => {
    this.serverService.createGuild(info)
  }

  getGuildId = async () => {

  }

  handleReactionAdd = async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();

    const entranceInfo = await this.serverService.getEntraceInfo(reaction.message.guildId as string);
    if (!entranceInfo) return;

    if (entranceInfo.role === "") {
      const a: Message = reaction.message as Message;
      const b: User = user as User;
      if (await this.serverService.getUserInfo(a.guildId as string, b.id) === UserType.Owner) {
        this.say(a, "쟌님 안녕하세요! \n" + "먼저 <제이름> 입장권한 역할 <역할명> 을 입력해주세요!");
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

  botReady = () => {
    console.log("연결")
  }

  makeInterval = (msg: Message) => {
    console.log("makeInterval");
    setInterval(() => {
      const a = this.command.sendStreamInfo(msg.guildId as string, "jisanjun")
      if (a !== undefined) {
        this.sayEmbed(msg, a)
      } else {
        console.log("interval undefined");
      }
    }, 60000)
  }

  clientMessage = async (msg: Message) => {
    if (!msg.guildId) return;
    if (msg.content === '쟌코봇설명서') {
      const prefix = await this.serverService.getGuildPrefix(msg.guildId);
      const response = this.command.introduceBot(msg.guild?.name as string, prefix);
      this.sayEmbed(msg, response);
      return;
    }
    if (!await this.command.isStartWithPrefix(msg)) return;

    const userType = await this.serverService.getUserInfo(msg.guildId as string, msg.author.id)
    let shouldContinue = true;
    const message = msg.content.split(" ")

    // If the user is an Owner, they can access all functionalities.
    if (userType === UserType.Owner) {
      shouldContinue = await this.ownerMessage(msg, message);

      if (shouldContinue) {
        shouldContinue = await this.botMakerMessage(msg, message);
      }
      if (shouldContinue) {
        shouldContinue = this.moderatorMessage(msg, message);
      }
      if (shouldContinue) {
        shouldContinue = this.normalMessage(msg, message);
      }
    }

    // If the user is a BotMaker, they can access BotMaker, Moderator and Normal functionalities
    else if (userType === UserType.BotMaker) {
      shouldContinue = await this.botMakerMessage(msg, message);

      if (shouldContinue) {
        shouldContinue = this.moderatorMessage(msg, message);
      }
      if (shouldContinue) {
        shouldContinue = this.normalMessage(msg, message);
      }
    }

    // If the user is a Moderator, they can access Moderator and Normal functionalities
    else if (userType === UserType.Moderator) {
      shouldContinue = this.moderatorMessage(msg, message);

      if (shouldContinue) {
        shouldContinue = this.normalMessage(msg, message);
      }
    }

    // If the user is Normal, they can only access Normal functionalities
    else if (userType === UserType.Normal) {
      shouldContinue = this.normalMessage(msg, message);
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
      this.serverService.updateBotMaker(msg.guildId as string, user.id);
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

      this.serverService.updateModeratorId(msg.guildId as string, moderators);
      this.say(msg, response)
      return false;
    }

    if (message[1] === '입장권한') {
      if (message[2]) {
        if (message[2] === '대사') {
          this.serverService.updateGuildEntranceQuote(msg.guildId as string, message[3]);
          this.say(msg, `입장대사가 ${message[3]}로 변경되었습니다.`);
          return false;
        } else if (message[2] === '이모지') {
          this.serverService.updateGuildEntranceEmoji(msg.guildId as string, message[3]);
          this.say(msg, `입장이모지가 ${message[3]}로 변경되었습니다.`);
          return false;
        } else if (message[2] === '역할') {
          if (msg.guild?.roles.cache.find(role => role.name === message[3]) === undefined) {
            this.say(msg, `해당 역할이 존재하지 않습니다.`);
            return false;
          }
          this.serverService.updateGuildEntranceRole(msg.guildId as string, message[3]);
          this.say(msg, `입장역할이 ${message[3]}로 변경되었습니다.`);
          return false;
        }
      } else {
        const entranceInfo = await this.serverService.getEntraceInfo(msg.guildId as string);
        this.sayEmbed(msg, showEntranceInfo(entranceInfo));
      }
      return false;
    }
    return true;
  }



  botMakerMessage = async (msg: Message, message: string[]): Promise<boolean> => {

    if (message[1] === 'status') {
      const ping = this.client.ws.ping;
      this.say(msg, `
        현재 시각 : ${new Date()} \n 
        핑 : ${ping}ms
      `)
      return false;
    }
    if (message[1] === '입장권') {
      const entranceInfo = await this.serverService.getEntraceInfo(msg.guildId as string);
      const a = await this.say(msg, `${entranceInfo.quote}`)
      if (a) {
        this.serverService.saveEntranceMessageId(msg.guildId as string, a.id);
        a.react(entranceInfo.emoji);

      } else {
        this.say(msg, "갱신 실패! ")
      }


      return false;
    }
    return true;
  }

  moderatorMessage = (msg: Message, message: string[]): boolean => {
    if (message[1] === '방송감지') {
      if (message[2] === '켜기') {
        this.serverService.updateStreamDetecting(msg.guildId as string, true);
        this.makeInterval(msg);
        this.say(msg, "데쟝님의 방송을 감지합니다!")
        return false;
      } else if (message[2] === '끄기') {
        this.serverService.updateStreamDetecting(msg.guildId as string, false);
        this.say(msg, "데쟝님의 방송을 감지하지 않습니다!")
        return false;
      } else {
        this.say(msg, "켜기 로 켜거나 끄기 로 끄세요!")
        return false;
      }
    }

    if (message[1] === '말투') {
      if (!message[3]) {
        this.say(msg, "뭔가 이상합니다! 잔코봇설명서 를 다시 봐주세요!")
        return false;
      }
      if (message[2] === '앞') {
        this.serverService.updateGuildPrefix(msg.guildId as string, message[3], true)
        this.say(msg, `접두사가 바뀌었습니다! \n` + `앞으로 절 부를땐 <<${message[3]}>> 하고 말해주세요!`);
        return false;
      } else if (message[2] === '뒤') {
        if (message[3] === '없음') {
          this.serverService.updateGuildPrefix(msg.guildId as string, "", false);
          this.say(msg, `난 이제 말투가 없습니다! \n`, " ");
          return false;
        } else {
          this.serverService.updateGuildPrefix(msg.guildId as string, message[3], false);
          this.say(msg, `접미사가 바뀌었습니다! \n` + `앞으로 제 말투는 <<${message[3]}>> 입니다!`, message[3]);
          return false;

        }
      }
    }

    return true;
  }

  normalMessage = (msg: Message, message: string[]): boolean => {
    if (msg.content.split(" ").length == 1) {
      this.say(msg, '부르셨나요?');
      return false;
    }
    return true;
  }

  say = async (msg: Message, context: string, givenPostfix?: string) => {
    const postfix = givenPostfix ? givenPostfix : await this.serverService.getGuildPostfix(msg.guildId as string);
    let toSay = "";
    context.split("\n").forEach((line) => {
      toSay += line + " " + postfix + "\n";
    });
    return msg.channel.send(toSay);
  }

  sayEmbed = async (msg: Message, context: any) => {
    const postfix = await this.serverService.getGuildPostfix(msg.guildId as string);
    const embed = context as EmbedBuilder;
    embed.setFooter({ text: " ..." + postfix })
    console.log(context);

    return msg.channel.send({ embeds: [embed] });
  }
}
