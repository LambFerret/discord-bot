import { MessageCommand } from './MessageCommand';
import { embededMsg } from './MessageFormat';
import { CONFIG } from "./Config";
import {ExternalApi} from './ExternalAPI'
import { Client, Message, GatewayIntentBits, EmbedBuilder } from "discord.js";
// import { saveStreamer } from './mongoConnect';
// config
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// constant
let isStarted = false;
const api = new ExternalApi();
const command = new MessageCommand();
// client init
client.on('ready', async () => {
  console.log('연결');
})


// discord message
client.on('messageCreate',async (msg: Message) => {
  const content = msg.content
  if (!command.isStartWithPrefix(content)) return;
  const message = content.split(' ')
  // DB 작업

  if (content.includes("저장")) {
  }

  if (message[1] === '로드') {
    const result = await command.sendLiveInfo(message[2]);
    msg.channel.send({embeds:[result]})
  }


  // if (content.includes("정보")) {
  //   msg.channel.send({ embeds: [embededMsg()] })
  // }
  // if (!isStarted && content.includes("스타또")) {
  //   isStarted = !isStarted
  //   reminder(msg)
  //   setInterval(() => reminder(msg), 3600000);
  // }

  // if (isStarted && content.includes("알람") && content.includes("그만")) {
  //   isStarted = !isStarted
  // }

});

function reminder(msg: Message) {
  const d = new Date()
  if (d.getHours() == 20) {
    msg.channel.send('댱이 트위치 방송중! : ' + CONFIG.twitch)
  }
}



// const isStreaming = async (user) => {
//   const twitchEndpoint = `https://api.twitch.tv/${user}/streams`
//   const result = await axios.get(twitchEndpoint).headers({
//     "Client-Id": config.twitchClientID
//   })
//   console.log(result);


// }


client.login(CONFIG.TOKEN);