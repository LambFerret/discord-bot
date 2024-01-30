import { Client, EmbedBuilder } from "discord.js";
import * as cron from "node-cron";
import api from "../ExternalAPI";
import { DetectPlatform } from "../model/DetectType";
import ServerRepository from "../repository/ServerRepository";

export default class PostService {
    client: Client;
    constructor(client: Client) {
        this.client = client;
    }

    checkPost = async (guildId: string) => {
        const info = await ServerRepository.getDetectInfo(guildId);
        if (info.newPostDetect.chzzk) {
            await this.sendChzzkBroadcastInfo(guildId);
        }
        if (info.newPostDetect.afreeca) {
            await this.sendAfreecaStreamInfo(guildId);
        }
        if (info.newPostDetect.youtube) {
            // await this.sendYoutubeBroadcastInfo(guildId);
        }
    }

    makeCron = (guildId: string) => {
        // make cron of checkPost() 
        cron.schedule('* * * * *', () => {
            this.checkPost(guildId);
        });
    }

    sendChzzkBroadcastInfo = async (guildId: string) => {
        const dto = await ServerRepository.checkStreamLive(guildId, DetectPlatform.Chzzk);
        if (dto.id === undefined) return undefined;
        const postIDs = await ServerRepository.getNewPostByPlatform(guildId, DetectPlatform.Chzzk);
        const latestPostID = await api.getChzzkCommunityNewPostInfo(dto.id);

        if (!latestPostID || latestPostID?.length == 0) return;

        if (postIDs.includes(latestPostID[0].id.toString())) return;
        else {
            latestPostID.forEach(post => {
                if (!(postIDs.includes(post.id.toString()))) postIDs.push(post.id.toString());
            });
            ServerRepository.updateNewPostByPlatform(guildId, DetectPlatform.Chzzk, postIDs);
            const embed = new EmbedBuilder()
                .setTitle("새로운 포스트가 올라왔습니다!")
                .setDescription(latestPostID[0].content.slice(0, 50) + "...")
                .setURL(`https://chzzk.naver.com/${dto.id}/community/detail/${latestPostID[0].id}`)
                .setColor(0x0099ff);
            if (latestPostID[0].attachedImageURL) embed.setImage(latestPostID[0].attachedImageURL);
            this.say(guildId, embed);
        }
    }

    sendAfreecaStreamInfo = async (guildId: string) => {
        const dto = await ServerRepository.checkStreamLive(guildId, DetectPlatform.Afreeca);
        if (dto.id === undefined) return undefined;
        const setting = await ServerRepository.getServerSettings(guildId);
        const postIDs: string[] = await ServerRepository.getNewPostByPlatform(guildId, DetectPlatform.Afreeca);
        const latestPostID = await api.getAfreecaCommunityNewPostInfo(dto.id, setting.afreecaNewPostOnlyAnnouncement === "" ? undefined : setting.afreecaNewPostOnlyAnnouncement);

        if (!latestPostID || latestPostID?.length == 0) return;

        if (postIDs.includes(latestPostID[0].id.toString())) return;
        else {
            latestPostID.forEach(post => {
                if (!(postIDs.includes(post.id.toString()))) postIDs.push(post.id.toString());
            });
            ServerRepository.updateNewPostByPlatform(guildId, DetectPlatform.Afreeca, postIDs);
            if (
                (setting.afreecaNewPostOnlyAnnouncement.length == 0) ||
                (setting.afreecaNewPostOnlyAnnouncement.length > 0 && setting.afreecaNewPostOnlyAnnouncement.includes(latestPostID[0].type.toString()))
            ) {
                const embed = new EmbedBuilder()
                    .setTitle("NEW POST 📌 " + latestPostID[0].title)
                    .setDescription(latestPostID[0].content.slice(0, 50) + "...")
                    .setURL(`https://bj.afreecatv.com/${dto.id}/post/${latestPostID[0].id}`)
                    .setColor(0x0099ff);
                if (latestPostID[0].attachedImageURL) embed.setImage(latestPostID[0].attachedImageURL);

                this.say(guildId, embed);
                console.log("-0-0-0-0-0-0-0-0-0-0")

            }
        }
    }


    say = async (guildId: string, msg: EmbedBuilder) => {
        const channelID = await ServerRepository.getDetectChannel(guildId);
        const channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(channelID);
        if (channel && channel.isTextBased()) {
            channel.send({ embeds: [msg] });
        } else {
            console.log(`ERROR IN ALARM | guildID - ${guildId}, channelID - ${channelID}, message - ${msg.data.title}`);
        }
    }
}