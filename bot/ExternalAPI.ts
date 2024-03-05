import axios from 'axios';
import { google } from 'googleapis';
import { CONFIG } from './config/Config';
import { LiveAfreecaInfoType } from './model/LiveAfreecaInfoType';
import { LiveChzzkInfoType } from './model/LiveChzzkInfoType';
import { LiveStreamInfoType } from './model/LiveStreamInfoType';
import { NewPostChzzkInfoType } from './model/NewPostChzzkInfoType';
import { YoutubeChannelInfoType } from './model/YoutubeChannelInfoType';

class ExternalApi {
    token: Promise<string>
    userAgent: string;
    constructor() {
        this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36';

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

        const res = await axios
            .get(endpoint, {
                headers: { 'User-Agent': this.userAgent },
            })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error(err.code + ":" + err.message);
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
                console.error("getTwitchLiveInfo Error")
                console.error(err)
                return undefined
            });
        return result;
    }

    getAfreecaLiveInfo = async (streamerID: string): Promise<LiveAfreecaInfoType | undefined> => {
        const endpoint = `https://bjapi.afreecatv.com/api/${streamerID}/station`;
        const res = await axios
            .get(endpoint, {
                headers: { 'User-Agent': this.userAgent },
            })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error("getAfreecaLiveInfo Error")
                console.error(err)
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

    searchYoutubeChannelIDWithTitle = async (youtubeTitle: string): Promise<YoutubeChannelInfoType[]> => {
        const youtube = google.youtube('v3');
        const param = {
            key: CONFIG.YOUTUBE_API_KEY,
            part: 'snippet',
            q: youtubeTitle,
            type: 'channel',
            maxResults: 10,
        } as any;

        const items = (await youtube.search.list(param)).data.items;

        // change this dto type
        const results: YoutubeChannelInfoType[] = [];
        items?.forEach(e => {
            const dto = {
                id: "",
                channelTitle: "",
                description: "--",
                url: "",
                thumbnail: "",
            } as YoutubeChannelInfoType;
            if (e.id?.channelId) dto.id = e.id.channelId;
            if (e.snippet?.title) dto.channelTitle = e.snippet.title;
            if (e.snippet?.description) dto.description = e.snippet.description.slice(0, 40);
            results.push(dto);
        });
        return results;
    }

    searchYoutubeByChannelID = async (channelID: string): Promise<YoutubeChannelInfoType | undefined> => {
        const youtube = google.youtube('v3');
        const param = {
            key: CONFIG.YOUTUBE_API_KEY,
            part: 'snippet',
            id: channelID,
        } as any;
        const items = (await youtube.channels.list(param)).data.items;
        if (!items) return undefined;
        const item = items[0];

        const dto = {
            id: channelID,
            channelTitle: "",
            description: "--",
            url: "",
            thumbnail: "",
            isLive: false //items[0].snippet?. === "live" ? true : false,
        } as YoutubeChannelInfoType;
        if (item.snippet?.title) dto.channelTitle = item.snippet.title;
        if (item.snippet?.description) dto.description = item.snippet.description;
        if (item.snippet?.customUrl) dto.url = item.snippet.customUrl;
        if (item.snippet?.thumbnails?.default?.url) dto.thumbnail = item.snippet.thumbnails.default.url;
        return dto;
    }

    getYoutubeLiveInfo = async (channelID: string): Promise<YoutubeChannelInfoType | undefined> => {
        const youtube = google.youtube('v3');
        const param = {
            key: CONFIG.YOUTUBE_API_KEY,
            part: 'snippet',
            id: channelID,
        } as any;
        let items;
        try {
            items = (await youtube.search.list(param)).data.items;
            if (!items) return undefined;
        } catch (err : any) {
            console.error("getYoutubeLiveInfo Error");
            console.error(err.errors[0]);
            return undefined;
        }
        const dto = {
            id: items[0].snippet?.liveBroadcastContent,
            channelTitle: "",
            description: "--",
            url: "",
            thumbnail: "",
            isLive: items[0].snippet?.liveBroadcastContent === "live" ? true : false,
        } as YoutubeChannelInfoType;
        const urlData = await this.searchYoutubeByChannelID(channelID);
        if (items[0].snippet?.channelTitle) dto.channelTitle = items[0].snippet.channelTitle;
        if (items[0].snippet?.channelTitle) dto.description = items[0].snippet.channelTitle;
        if (urlData?.url) dto.url = urlData.url;
        if (items[0].snippet?.thumbnails?.default?.url) dto.thumbnail = items[0].snippet.thumbnails.default.url;
        return dto;

    }


    getChzzkCommunityNewPostInfo = async (streamerID: string): Promise<NewPostChzzkInfoType[] | undefined> => {
        const endpoint = `https://apis.naver.com/nng_main/nng_comment_api/v1/type/CHANNEL_POST/id/${streamerID}/comments?limit=10`
        const res = await axios
            .get(endpoint, {
                headers: { 'User-Agent': this.userAgent },
            })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error("getChzzkCommunityNewPostInfo Error")
                const errorData = err?.response?.data;
                console.error(errorData);
                return errorData;
            });

        if (res.code !== 200) {
            // TODO 채팅창에 한번 말해준 후 detecting을 false로 바꿔준다.
            return undefined;
        }

        if (Object.keys(res.content).length === 0) return;

        const data = await res.content.comments.data;
        const postIDs: NewPostChzzkInfoType[] = [];
        data.forEach((d: any) => {
            const post = d.comment;
            if (post.delete || post.secret || post.hideByCleanBot) return;
            if (streamerID !== post.objectId) return;
            const postInfo: NewPostChzzkInfoType = {
                id: post.commentId,
                type: post.commentType,
                title: "",
                content: post.content,
                createdDate: post.createdDate,
            }
            if (post.attaches !== null)
                for (const e of post.attaches) {
                    if (e.attachType === 'PHOTO') {
                        postInfo.attachedImageURL = e.attachValue;
                        break;
                    }
                }

            postIDs.push(postInfo);
        });

        return postIDs;
    }

    getAfreecaCommunityNewPostInfo = async (streamerID: string, boardId?: string): Promise<NewPostChzzkInfoType[] | undefined> => {
        let endpoint;
        if (boardId) {
            endpoint = `https://bjapi.afreecatv.com/api/${streamerID}/board/${boardId}?page=1&per_page=20&field=user_nick%2Cuser_id&keyword=${streamerID}&type=all&board_id=${boardId}`
        } else {
            endpoint = `https://bjapi.afreecatv.com/api/${streamerID}/board?page=1&per_page=10&field=user_nick%2Cuser_id&keyword=${streamerID}&type=all`
        }
        const res = await axios
            .get(endpoint, {
                headers: { 'User-Agent': this.userAgent },
            })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error("getAfreecaCommunityNewPostInfo Error");
                const errorData = err?.response?.data;
                console.error(errorData);
                return errorData;
            });


        // console.log(res);
        if (res.code === 9000) {
            // TODO 채팅창에 한번 말해준 후 detecting을 false로 바꿔준다.
            return undefined;
        }

        const data = await res.data;
        if (data === undefined) return undefined;
        const postIDs: NewPostChzzkInfoType[] = [];

        data.forEach((post: any) => {
            const postInfo: NewPostChzzkInfoType = {
                id: post.title_no,
                type: post.bbs_no,
                title: post.title_name,
                content: post.content.summary,
                createdDate: post.reg_date,
            }
            if (post.photo_cnt > 0) postInfo.attachedImageURL = post.photos[0].url.replace('//', 'https://');
            postIDs.push(postInfo);
        });

        return postIDs;
    }
}
export default new ExternalApi();