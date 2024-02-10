
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember } from 'discord.js';
import BotConfig, { MessageColor } from './BotConfig';
import { LiveAfreecaInfoType } from './model/LiveAfreecaInfoType';
import { LiveChzzkInfoType } from './model/LiveChzzkInfoType';
import { LiveStreamInfoType } from "./model/LiveStreamInfoType";
import { YoutubeChannelInfoType } from './model/YoutubeChannelInfoType';

export const twitchLiveInfoMsg = async (guildId: string, data: LiveStreamInfoType) => {
  const embed = await BotConfig.makeEmbed(
    `${data.user_name} 트위치 뱅온!`,
    data.title,
    MessageColor.Default,
    guildId
  )
  embed.setURL("https://twitch.tv/" + data.user_login)
  //  .setThumbnail("https://static-cdn.jtvnw.net/previews-ttv/live_user_"+CONFIG.TWITCH_STREAMER_ID+".jpg")
  return embed;
}
export const afreecaLiveInfoMsg = async (guildId: string, data: LiveAfreecaInfoType) => {
  const embed = await BotConfig.makeEmbed(
    `${data.user_nick} 아프리카 뱅온!`,
    data.broad_title,
    MessageColor.Default,
    guildId
  )
  embed.setURL("https://play.afreecatv.com/" + data.user_id)
    .setThumbnail("https://liveimg.afreecatv.com/h/" + data.broad_no + ".webp");
  return embed;
}

export const chzzkLiveInfoMsg = async (guildId: string, data: LiveChzzkInfoType) => {
  const embed = await BotConfig.makeEmbed(
    `${data.channelName} 치지직 뱅온!`,
    data.liveTitle,
    MessageColor.Default,
    guildId
  )
  embed.setURL("https://chzzk.naver.com/live/" + data.channelId)
    .setThumbnail(data.channelImageUrl);
  return embed;
}

export const youtubeLiveInfoMsg = async (guildId: string, data: YoutubeChannelInfoType) => {

  const embed = await BotConfig.makeEmbed(
    `${data.description} 유튜브 뱅온!`,
    data.channelTitle,
    MessageColor.Default,
    guildId
  )
  embed
    .setThumbnail(data.thumbnail)
  // .setURL("https://www.youtube.com/" + data.description)
  return embed;
}

export const introduceBotWithDM = async (member: GuildMember) => {
  const dm = await member.createDM();

  const title = "Hello! World! (✿◠‿◠)";
  const description = "안녕하세요! \`하우미\` 입니다! \n 저를 사용하시기 위해 몇가지 설정이 필요합니다! ξ(✿ ❛‿❛)ξ 아래의 단계를 거치면 설정이 완료돼요 ( ' ▽ ' )ﾉ  \n\n" +
    "더욱 자세한 설명서는 [여기서 보실 수 있습니다!](https://terrific-slipper-728.notion.site/Hellow-Howmee-c8049b3ee7ef42f7adc714759fd4ad4f#30d3287b85d6483daf806483fd14584c) \`/\`를 누르시고 한번 둘러보세요! \n"
    + "================================================"


  const embed = await BotConfig.makeEmbed(
    title,
    description,
    MessageColor.Default,
    member.guild.id
  )
  embed.addFields(
    {
      name: "1️⃣ 등록",
      value: "\`/알림채널등록\` 으로 방송 알림을 보낼 채널을 설정합니다. \n", inline: false
    },
    {
      name: "2️⃣ 정보입력",
      value: "\`/등록\`으로 주인님의 방송 정보를 입력해주세요! \n", inline: false
    },
    {
      name: "3️⃣ 감지설정",
      value: "\`/감지\`를 통해 원하는 기능을 on 해주세요! 모든 감지는 켜고 끌 수 있습니다! \n "
        + "================================================", inline: false
    },
    {
      name: "(선택) 입장채널등록",
      value: "1. \`/입장역할\` 으로 역할을 설정합니다. \n"
        + "2. \`/입장채널\` 으로 입장채널을 설정합니다. \n"
        + "3. \`/입장메시지\`과 \`/입장이모지 로 세부사항을 변경할 수 있습니다. \n"
      , inline: false
    }
  )

  const urlButtons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setLabel("자세한 설명서")
        .setStyle(ButtonStyle.Link)
        .setURL("https://terrific-slipper-728.notion.site/Hellow-Howmee-c8049b3ee7ef42f7adc714759fd4ad4f#30d3287b85d6483daf806483fd14584c"),
      // new ButtonBuilder()
      //   .setLabel("봇 초대하기")
      //   .setStyle(ButtonStyle.Link)
      //   .setURL("https://discord.com/api/oauth2/authorize?client_id=989700084809756692&permissions=8&scope=bot"),
      new ButtonBuilder()
        .setLabel("공식 서버")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/99ZNZ8G2"),
      new ButtonBuilder()
        .setLabel("매달 후원하기")
        .setStyle(ButtonStyle.Link)
        .setURL("https://www.patreon.com/HowMee"),
        new ButtonBuilder()
        .setLabel("커피한잔 사주기")
        .setStyle(ButtonStyle.Link)
        .setURL("https://toss.me/하우미하움하움")
    )

  dm.send({ embeds: [embed], components: [urlButtons] });
}
