import { MessageCommand } from './MessageCommand';
import { CONFIG } from "./config/Config";
import { ExternalApi } from './ExternalAPI'
import { Client, Message, GatewayIntentBits, Guild } from "discord.js";
import ServerService from './service/ServerService';
import StreamerService from './service/StreamerService';
import { userNotExistMsg } from './MessageFormat';


export default class DiscordBot {

  serverService: ServerService;
  streamerService: StreamerService;
  command: MessageCommand;
  api: ExternalApi;
  client: Client;

  constructor() {
    this.streamerService = new StreamerService();
    this.serverService = new ServerService();
    this.command = new MessageCommand();
    this.api = new ExternalApi();
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
    });
    this.client.login(CONFIG.TOKEN);
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
    // DB 작업

    if (content.includes("저장")) {
    }

    if (message[1] === '로드') {
      console.log(message);

      const result = await this.command.sendLiveInfo(message[2])
        .catch(error => userNotExistMsg());
      msg.channel.send({ embeds: [result] })

    }


  }
}


// if (!isStarted && content.includes("스타또")) {
//   isStarted = !isStarted
//   reminder(msg)
//   setInterval(() => reminder(msg), 3600000);
// }

// if (isStarted && content.includes("알람") && content.includes("그만")) {
//   isStarted = !isStarted
// }

// });

function reminder(msg: Message) {
  const d = new Date()
  if (d.getHours() == 20) {
    msg.channel.send('댱이 트위치 방송중! : ' + CONFIG.twitch)
  }
}
