"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cron = tslib_1.__importStar(require("node-cron"));
const BotConfig_1 = tslib_1.__importStar(require("../BotConfig"));
const ExternalAPI_1 = tslib_1.__importDefault(require("../ExternalAPI"));
const DetectType_1 = require("../model/DetectType");
const ServerRepository_1 = tslib_1.__importDefault(require("../repository/ServerRepository"));
class PostService {
    client;
    constructor(client) {
        this.client = client;
    }
    checkPost = async (guildId) => {
        let info;
        try {
            info = await ServerRepository_1.default.getDetectInfo(guildId);
        }
        catch (e) {
            return;
        }
        if (!info)
            return;
        if (info.newPostDetect.chzzk) {
            await this.sendChzzkBroadcastInfo(guildId);
        }
        if (info.newPostDetect.afreeca) {
            await this.sendAfreecaStreamInfo(guildId);
        }
        if (info.newPostDetect.youtube) {
            // await this.sendYoutubeBroadcastInfo(guildId);
        }
    };
    makeCron = (guildId) => {
        // make cron of checkPost() 
        cron.schedule('* * * * *', () => {
            this.checkPost(guildId);
        });
    };
    sendChzzkBroadcastInfo = async (guildId) => {
        const dto = await ServerRepository_1.default.checkStreamLive(guildId, DetectType_1.DetectPlatform.Chzzk);
        if (dto.id === undefined)
            return;
        if (dto.id === "")
            return;
        const postIDs = await ServerRepository_1.default.getNewPostByPlatform(guildId, DetectType_1.DetectPlatform.Chzzk);
        const latestPostID = await ExternalAPI_1.default.getChzzkCommunityNewPostInfo(dto.id);
        if (!latestPostID || latestPostID?.length == 0)
            return;
        if (postIDs.includes(latestPostID[0].id.toString()))
            return;
        else {
            latestPostID.forEach(post => {
                if (!(postIDs.includes(post.id.toString())))
                    postIDs.push(post.id.toString());
            });
            ServerRepository_1.default.updateNewPostByPlatform(guildId, DetectType_1.DetectPlatform.Chzzk, postIDs);
            const embed = await BotConfig_1.default.makeEmbed("새로운 포스트가 올라왔습니다!", latestPostID[0].content.slice(0, 50) + "...", BotConfig_1.MessageColor.Default, guildId);
            embed.setURL(`https://chzzk.naver.com/${dto.id}/community/detail/${latestPostID[0].id}`);
            if (latestPostID[0].attachedImageURL)
                embed.setImage(latestPostID[0].attachedImageURL);
            this.say(guildId, embed);
        }
    };
    sendAfreecaStreamInfo = async (guildId) => {
        const dto = await ServerRepository_1.default.checkStreamLive(guildId, DetectType_1.DetectPlatform.Afreeca);
        if (dto.id === undefined)
            return;
        if (dto.id === "")
            return;
        const setting = await ServerRepository_1.default.getServerSettings(guildId);
        const postIDs = await ServerRepository_1.default.getNewPostByPlatform(guildId, DetectType_1.DetectPlatform.Afreeca);
        const latestPostID = await ExternalAPI_1.default.getAfreecaCommunityNewPostInfo(dto.id, setting.afreecaNewPostOnlyAnnouncement === "" ? undefined : setting.afreecaNewPostOnlyAnnouncement);
        if (!latestPostID || latestPostID?.length == 0)
            return;
        if (postIDs.includes(latestPostID[0].id.toString()))
            return;
        else {
            latestPostID.forEach(post => {
                if (!(postIDs.includes(post.id.toString())))
                    postIDs.push(post.id.toString());
            });
            ServerRepository_1.default.updateNewPostByPlatform(guildId, DetectType_1.DetectPlatform.Afreeca, postIDs);
            if ((setting.afreecaNewPostOnlyAnnouncement.length == 0) ||
                (setting.afreecaNewPostOnlyAnnouncement.length > 0 && setting.afreecaNewPostOnlyAnnouncement.includes(latestPostID[0].type.toString()))) {
                const embed = await BotConfig_1.default.makeEmbed("NEW POST 📌 " + latestPostID[0].title, latestPostID[0].content.slice(0, 50) + "...", BotConfig_1.MessageColor.Default, guildId);
                embed.setURL(`https://bj.afreecatv.com/${dto.id}/post/${latestPostID[0].id}`);
                if (latestPostID[0].attachedImageURL)
                    embed.setImage(latestPostID[0].attachedImageURL);
                this.say(guildId, embed);
            }
        }
    };
    say = async (guildId, msg) => {
        const channelID = await ServerRepository_1.default.getDetectChannel(guildId);
        const channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(channelID);
        const setting = await ServerRepository_1.default.getServerSettings(guildId);
        if (channel && channel.isTextBased()) {
            channel.send({ content: setting.newPostIncludeEveryone ? "@everyone" : "", embeds: [msg] });
        }
        else {
            console.log(`ERROR IN ALARM | guildID - ${guildId}, channelID - ${channelID}, message - ${msg.data.title}`);
        }
    };
}
exports.default = PostService;
//# sourceMappingURL=PostService.js.map