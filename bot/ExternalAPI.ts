import axios from 'axios';
import { CONFIG } from './config/Config';
import { LiveStreamInfoType } from './model/LiveStreamInfoType';
import { LiveAfreecaInfoType } from './model/LiveAfreecaInfoType';

export enum StreamType {
    Twitch,
    Afreeca,
    Youtube,
}

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

    getTwitchLiveInfo = async (streamer: string) => {
        const url = encodeURI(CONFIG.TWITCH_API_GATEWAY + "streams?user_login=" + streamer)
        return await axios({
            url: url,
            method: 'get',
            headers: {
                'Client-Id': CONFIG.TWITCH_CLIENT_ID,
                'Authorization': 'Bearer ' + await this.token
            },
        }).then(v => v.data.data[0] as LiveStreamInfoType);
    }

    getAfreecaLiveInfo = async (streamer: string): Promise<LiveAfreecaInfoType> => {
        const endpoint = `https://bjapi.afreecatv.com/api/${streamer}/station`;
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

        if (res.code == 9000) {
            liveInfo.isLive = false;
            return liveInfo;
        }

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
export { ExternalApi };
