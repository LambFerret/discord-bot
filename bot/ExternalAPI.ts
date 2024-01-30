import axios from 'axios';
import { CONFIG } from './config/Config';
import { LiveStreamInfoType } from './model/LiveStreamInfoType';
import { LiveAfreecaInfoType } from './model/LiveAfreecaInfoType';
import { LiveChzzkInfoType } from './model/LiveChzzkInfoType';

class ExternalApi {
    token: Promise<string>
    constructor() {
        this.token = this.getAccessToken()
    }

    getAccessToken = async () =>
        await axios({
            url: "https://id.twitch.tv/oauth2/token",
            method: 'post',
            params: {
                'client_id': CONFIG.TWITCH_CLIENT_ID,
                'client_secret': CONFIG.TWITCH_CLIENT_SECRET,
                'grant_type': 'client_credentials'
            }
        }).then(v => v.data.access_token) as string;

    getChzzkLiveInfo = async (streamerID: string): Promise<LiveChzzkInfoType | undefined> => {
        const endpoint = `https://api.chzzk.naver.com/service/v2/channels/${streamerID}/live-detail`;
        const userAgent =
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36';
        const res = await axios
            .get(endpoint, {
                headers: { 'User-Agent': userAgent },
            })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err.response.data;
            });

        if (res.code !== 200) {
            // TODO 채팅창에 한번 말해준 후 detecting을 false로 바꿔준다.
            return undefined;
        }

        const liveInfo: LiveChzzkInfoType = {
            channelId: res.content.channel.channelId,
            channelName: res.content.channel.channelName,
            channelImageUrl: res.content.channel.channelImageUrl,
            liveStatus: res.content.status === "OPEN" ? true : false,
            liveImageUrl: res.content.liveImageUrl,
            liveTitle: res.content.liveTitle,
        }

        return liveInfo;
    }

    getTwitchLiveInfo = async (streamerID: string): Promise<LiveStreamInfoType | undefined> => {
        const url = encodeURI(CONFIG.TWITCH_API_GATEWAY + "streams?user_login=" + streamerID)
        const result = await axios({
            url: url,
            method: 'get',
            headers: {
                'Client-Id': CONFIG.TWITCH_CLIENT_ID,
                'Authorization': 'Bearer ' + await this.token
            },
        }).then(v => v.data.data[0] as LiveStreamInfoType)
            .catch(err => {
                console.log(err)
                return undefined
            });
        return result;
    }

    getAfreecaLiveInfo = async (streamerID: string): Promise<LiveAfreecaInfoType | undefined> => {
        const endpoint = `https://bjapi.afreecatv.com/api/${streamerID}/station`;
        const userAgent =
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36';
        const res = await axios
            .get(endpoint, {
                headers: { 'User-Agent': userAgent },
            })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err.response.data;
            });

        const liveInfo: LiveAfreecaInfoType = {
            user_id: "",
            user_nick: "",
            profile_image: "",
            broad_no: 0,
            broad_title: "",
            isLive: false,
        };

        if (res.code == 9000) return undefined;

        liveInfo.user_id = res.station.user_id;
        liveInfo.user_nick = res.station.user_nick;
        liveInfo.profile_image = res.profile_image;

        if (res.broad == null) {
            liveInfo.isLive = false;
            return liveInfo;
        } else {
            liveInfo.broad_no = res.broad.broad_no;
            liveInfo.broad_title = res.broad.broad_title;
            liveInfo.isLive = true;
            return liveInfo;
        }
    }
}
export default new ExternalApi();