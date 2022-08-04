import axios from 'axios';
import { LiveStreamerInfoType } from './model/LiveStreamerInfoType';
import { LiveStreamInfoType } from './model/LiveStreamInfoType';
class ExternalApi {
    token:() => Promise<any>
    constructor() {
    this.token = async () =>
        await axios({
            url: "https://id.twitch.tv/oauth2/token",
            method: 'post',
            params: {
                'client_id': '4f0dkwr6ykwtyb5kqulxsse2wn1cqr',
                'client_secret': 'lxhahw7jw1edlmiwjymi87h6fezs8o',
                'grant_type': 'client_credentials'
            }
        }).then(v => v.data.access_token);
    }
    /**
     * live일 경우 :
     * 게임이름, 게임id, 방제, 청자수, 업타임, 라이브로 찍힌 썸넬, is_mature
     * @param streamer 
     * @returns 
     */
    getLiveInfo = async (streamer: string) => {
        const url = encodeURI("https://api.twitch.tv/helix/streams?user_login=" + streamer)
        return await axios({
            url: url,
            method: 'get',
            headers: {
                'Client-Id': '4f0dkwr6ykwtyb5kqulxsse2wn1cqr',
                'Authorization': 'Bearer ' + await this.token()
            },
            
        }).then(v => v.data.data[0] as LiveStreamInfoType);
    }

    /**
    * id, loginId, 표기이름, broadcaster_type(partner/or else), 프로필이미지, 오프라인이미지
    * 뷰카운트, 설립일
    */
    getStreamerInfo = async (streamer: string) => {
        const url = encodeURI("https://api.twitch.tv/helix/search/channels?first=1&query=" + streamer)
        return await axios({
            url: url,
            method: 'get',
            headers: {
                'Client-Id': '4f0dkwr6ykwtyb5kqulxsse2wn1cqr',
                'Authorization': 'Bearer ' + await this.token()
            }
        }).then(v => v.data.data[0] as LiveStreamerInfoType)
    }
}

export {ExternalApi};