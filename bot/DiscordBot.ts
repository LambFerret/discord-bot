import { MessageCommand } from './MessageCommand';
import { CONFIG } from "./config/Config";
import * as os from 'os';
import { Client, Message, GatewayIntentBits, Guild } from "discord.js";
import ServerService from './service/ServerService';
import StreamerService from './service/StreamerService';

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
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
    });
    this.client.login(CONFIG.DISCORD_BOT_TOKEN);
    this.client.once('ready', this.botReady)
    this.client.on('guildCreate', this.clientInit)
    this.client.on('guildDelete', this.serverClosed)
    this.client.on('messageCreate', this.clientMessage)
  }

  getGuildId = async () => {

  }

  botReady = () => {
    console.log("연결")
  }

  clientInit = (info: Guild) => {
    this.serverService.createGuild(info)
  }

  serverClosed = (info: Guild) => {
    this.serverService.deleteGuild(info.id)
  }

  clientMessage = async (msg: Message) => {
    if (!await this.command.isStartWithPrefix(msg)) return;
    const message = msg.content.split(' ')

    if (message.length == 1) {
      msg.channel.send('불렀느냐!');
      return;
    }

    if (message[1] === '말투') {
      this.command.changePrefix(msg.guildId, message[2])
      msg.channel.send(`접두사가 바뀌었다! \n` + `앞으로 날 부를땐 <<${message[2]}>> 하고 말하거라!`);

    }

    if (message[1] === 'status') {
      msg.channel.send(`
        현재 접속중 hostname : ${os.hostname()} \n`
        + `현재 시각 : ${new Date()}
      `)
      return;
    }

    if (message[2].includes("저장")) {
      try {
        const result = await this.command.saveStreamerInfo(message[1], msg);
        msg.channel.send({ embeds: [result] })
      } catch (err) {
        msg.channel.send("에러다!")
        console.log(err);


      }
    }

    if (message[2].includes('방송')) {
      const result = await this.command.sendStreamInfo(message[1]);
      msg.channel.send({ embeds: [result] })
    }
  }
}


// if (!isStarted && content.includes("스타또")) {
//   isStarted = !isStarted
//   reminder(msg)
//   setInterval(() => reminder(msg), 3600000);
// }
// function reminder(msg: Message) {
//   const d = new Date()
//   if (d.getHours() == 20) {
//     msg.channel.send('댱이 트위치 방송중! : ' + CONFIG.twitch)
//   }
// }
