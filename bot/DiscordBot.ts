import { MessageCommand } from './MessageCommand';
import { CONFIG } from "./config/Config";
import * as os from 'os';
import { Client, Message, GatewayIntentBits, Guild } from "discord.js";
import ServerService from './service/ServerService';
import StreamerService from './service/StreamerService';
import util from 'util';

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
    const content = msg.content
    if (!this.command.isStartWithPrefix(content)) return;
    const message = content.split(' ')
    
    if (message[1]==='status') {
      msg.channel.send(`
        현재 접속중 hostname : ${os.hostname()} \n`
        +`현재 시각 : ${new Date()}
      `)
      return;
    }

    if (content.includes("저장")) {
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
