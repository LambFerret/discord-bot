import { LiveStreamInfoType } from "./LiveStreamInfoType";
import { EmbedBuilder } from 'discord.js';

export const embededMsg = (data: LiveStreamInfoType) => new EmbedBuilder()
  .setColor('#0000ff')
  .setTitle(data.user_name)
  .setURL("https://twitch.tv/" + data.user_login)
  .setDescription(data.game_name)
  .setThumbnail(data.thumbnail_url)
  // .addFields(
  //   { name: '트위터', value: config.twitter, inline: true },
  //   { name: '트위치 8시 방송', value: config.twitch, inline: true },
  //   { name: '유튜브(오픈예정)', value: config.youtube, inline: true },
  // )
  .setImage(data.thumbnail_url.replace("-{width}x{height}", ""))

export const offlineMsg = () => 
new EmbedBuilder().setTitle('존재하지 않는 아이디거나 라이브중이 아니다!')