
import { EmbedBuilder } from 'discord.js';
import { LiveStreamerInfoType } from "./model/LiveStreamerInfoType";
import { LiveStreamInfoType } from "./model/LiveStreamInfoType";
import { Entrance } from './model/ServerType';
import { LiveAfreecaInfoType } from './model/LiveAfreecaInfoType';
import { CONFIG } from './config/Config';
import { LiveChzzkInfoType } from './model/LiveChzzkInfoType';

export const twitchLiveInfoMsg = (data: LiveStreamInfoType) =>
  new EmbedBuilder()
    .setColor('#0000ff')
    .setTitle(`${data.user_name} 트위치 뱅온!`)
    .setDescription(data.title)
    .setURL("https://twitch.tv/" + data.user_login)
//  .setThumbnail("https://static-cdn.jtvnw.net/previews-ttv/live_user_"+CONFIG.TWITCH_STREAMER_ID+".jpg")

export const afreecaLiveInfoMsg = (data: LiveAfreecaInfoType) =>
  new EmbedBuilder()
    .setColor('#0000ff')
    .setTitle(`${data.user_nick} 아프리카 뱅온!`)
    .setDescription(data.broad_title)
    .setURL("https://play.afreecatv.com/" + data.user_id)
    .setThumbnail("https://liveimg.afreecatv.com/h/" + data.broad_no + ".webp");

export const chzzkLiveInfoMsg = (data: LiveChzzkInfoType) => {
  return new EmbedBuilder()
    .setColor('#0000ff')
    .setTitle(`${data.channelName} 치지직 뱅온!`)
    .setDescription(data.liveTitle)
    .setURL("https://chzzk.naver.com/live/" + data.channelId)
    .setThumbnail(data.channelImageUrl)
}

export const introduceBot = (name: string, myName: string) => {
  return new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`${name} 서버의 쟌코봇입니다!`)
    .setDescription(`제가 할 수 있는 일은 다음과 같습니다!`)
    .addFields(
      {
        "name": "\u200B",
        "value": "\u200B",
      }
    )
    .addFields(
      {
        "name": `데쟝님 전용 명령어!`,
        "value": "데쟝님은 이하 모든 명령어를 사용가능하십니다!",
        "inline": true
      },
      {
        "name": `\`${myName} 봇권한 @상대\``,
        "value": `상대에게 쟌코봇의 관리 권한을 줍니다! 하지만 쟌코봇 관리자는 한명밖에 지정이 안됩니다!`
      },
      {
        "name": `\`${myName} 관리자 <권한명>\``,
        "value": `내가 관리자이름이 무엇인지 알게해줍니다! 관리자이름을 바꿨다면 이 명령어를 써주세요!`
      },
      {
        "name": `\`${myName} 입장권한 <명령어> <내용>\``,
        "value": `입장권을 설정해줍니다! \n\`|    \`명령어 : 대사, 이모지, 역할 \n\`|    \`ex) ${myName} 입장권한 대사 안녕하세요! `
      },
      {
        "name": `\`${myName} 입장권한\``,
        "value": `입장권한정보를 알려줍니다!`
      }
    )
    .addFields(
      {
        "name": "\u200B",
        "value": "\u200B",
      }
    )
    .addFields(
      {
        "name": `봇 관리쟌코 명령어!`,
        "value": "\u200B",
        "inline": true
      },
      {
        "name": `\`${myName} status \``,
        "value": `핑 확인!`
      }, {
      "name": `\`${myName} 입장권 \``,
      "value": `현 채널에 입장 대사를 적습니다!`
    },
    )
    .addFields(
      {
        "name": "\u200B",
        "value": "\u200B",
      }
    )
    .addFields(
      {
        "name": `관리자 명령어!`,
        "value": "\u200B",
        "inline": true
      },
      {
        "name": `\`${myName} 말투 앞 <내용> \``,
        "value": `내이름을 설정해줍니다!`
      },
      {
        "name": `\`${myName} 말투 뒤 <내용> \``,
        "value": `내말투를 설정해줍니다!`
      },
      {
        "name": `\`${myName} 방송감지 켜기|끄기 \``,
        "value": `데쟝님의 방송을 감지합니다!`
      },

    )
    .addFields({ name: 'Version', value: '1.0', inline: true })
    .setThumbnail('https://your-image-url.com/thumbnail.jpg')
}

export const showEntranceInfo = (entrance: Entrance) => {
  return new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`현재 입장권한 정보입니다!`)
    .setDescription(`입장대사 : ${entrance.quote} \n`
      + `입장이모지 : ${entrance.emoji} \n`
      + `입장역할 : ${entrance.role}`)
}
