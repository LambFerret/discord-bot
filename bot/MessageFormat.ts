import { LiveStreamInfoType } from "./model/LiveStreamInfoType";
import { EmbedBuilder } from 'discord.js';
import { LiveStreamerInfoType } from "./model/LiveStreamerInfoType";

export const StreamerInfoMsg = (data: LiveStreamerInfoType, imageurl: string | null) => {
  if (imageurl !== null) {
    imageurl = imageurl.replace("-{width}x{height}", "")
  }
  const title = data.is_live
    ? `${data.display_name}님의 ${data.game_name}방송이다!`
    : `${data.display_name}님은 현재 방송중이 아니시다!`
  return new EmbedBuilder()
    .setColor('#0000ff')
    .setTitle(title)
    .setDescription("방제 :" + data.title)
    .setURL("https://twitch.tv/" + data.broadcaster_login)
    .setThumbnail(data.thumbnail_url)
    .setImage(imageurl)
}

export const userNotExistMsg = () =>
  new EmbedBuilder().setTitle('존재하지 않는 아이디다!')