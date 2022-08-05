import { EmbedBuilder } from 'discord.js';
import { LiveStreamerInfoType } from "./model/LiveStreamerInfoType";

export const streamerLiveInfoMsg = (data: LiveStreamerInfoType, imageurl: string) =>
  new EmbedBuilder()
    .setColor('#0000ff')
    .setTitle(`${data.display_name}님의 ${data.game_name}방송이다!`)
    .setDescription("방제 :" + data.title)
    .setURL("https://twitch.tv/" + data.broadcaster_login)
    .setThumbnail(data.thumbnail_url)
    .setImage(imageurl.replace("-{width}x{height}", ""))


export const streamerOfflineInfoMsg = (data: LiveStreamerInfoType) =>
  new EmbedBuilder()
    .setColor('#0000ff')
    .setTitle(`${data.display_name}님은 현재 방송중이 아니시다!`)
    .setDescription(data.title)
    .setURL("https://twitch.tv/" + data.broadcaster_login)
    .setThumbnail(data.thumbnail_url)

export const userNotExistMsg = () =>
  new EmbedBuilder().setTitle('존재하지 않는 아이디다!')

export const streamerSaveMsg = (name: string) => {
  return new EmbedBuilder()
    .setTitle(name + '을 이 채널에 저장했다!')
    
}