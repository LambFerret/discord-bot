import axios from 'axios';
import { CONFIG } from './config/Config';
import { LiveStreamerInfoType } from './model/LiveStreamerInfoType';
import { LiveStreamInfoType } from './model/LiveStreamInfoType';
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

    getLiveInfo = async (streamer: string) => {
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

    getStreamerInfo = async (streamer: string) => {
        const url = encodeURI(CONFIG.TWITCH_API_GATEWAY + "search/channels?first=3&query=" + streamer)
        return await axios({
            url: url,
            method: 'get',
            headers: {
                'Client-Id': CONFIG.TWITCH_CLIENT_ID,
                'Authorization': 'Bearer ' + await this.token
            }
        }).then(v => v.data.data[0] as LiveStreamerInfoType)
    }
}
export { ExternalApi };