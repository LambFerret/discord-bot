"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solveDetectButtons = exports.detect = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const _1 = require(".");
const DetectType_1 = require("../model/DetectType");
const ServerRepository_1 = tslib_1.__importDefault(require("../repository/ServerRepository"));
const ID = _1.CommandName.Detect;
const commandText = _1.text[ID];
exports.detect = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),
    execute: async (interaction) => {
        await interaction.reply({ content: '카테고리를 선택하세요!', components: [initialButtons()] });
    }
};
exports.solveDetectButtons = {
    command: _1.CommandName.DetectButton,
    execute: async (interaction) => {
        const guildId = interaction.guildId;
        const info = await ServerRepository_1.default.getDetectInfo(guildId);
        const name = _1.RegisterButtonName[interaction.customId.split(":")[1]];
        switch (name) {
            case _1.RegisterButtonName.broadcast:
                await interaction.update({ content: '방송 감지를 선택하셨습니다!', components: [await broadcastButtons(guildId)] });
                return;
            case _1.RegisterButtonName.new_post:
                await interaction.update({ content: '새글 감지를 선택하셨습니다!', components: [await newPostButtons(guildId)] });
                return;
            case _1.RegisterButtonName.owner_chat:
                return; // TODO : This is not implemented yet
                await interaction.update({ content: '방장 채팅 감지를 선택하셨습니다!', components: [await ownerChatButtons(guildId)] });
                return;
            case _1.RegisterButtonName.else:
                return; // TODO : This is not implemented yet
                await interaction.update({ content: '(후추) 그외를 선택하셨습니다!', components: [await elseButtons(guildId)] });
                return;
            case _1.RegisterButtonName.back:
                await interaction.update({ content: '뒤로가기를 선택하셨습니다!', components: [initialButtons()] });
                return;
            case _1.RegisterButtonName.broadcast_chzzk:
                await ServerRepository_1.default.updateDetectInfo(guildId, interaction.channelId, DetectType_1.DetectType.Broadcast, DetectType_1.DetectPlatform.Chzzk, !info.broadcastDetect.chzzk);
                await interaction.update({ components: [await broadcastButtons(guildId)] });
                return;
            case _1.RegisterButtonName.broadcast_afreeca:
                await ServerRepository_1.default.updateDetectInfo(guildId, interaction.channelId, DetectType_1.DetectType.Broadcast, DetectType_1.DetectPlatform.Afreeca, !info.broadcastDetect.afreeca);
                await interaction.update({ components: [await broadcastButtons(guildId)] });
                return;
            case _1.RegisterButtonName.broadcast_youtube:
                await ServerRepository_1.default.updateDetectInfo(guildId, interaction.channelId, DetectType_1.DetectType.Broadcast, DetectType_1.DetectPlatform.Youtube, !info.broadcastDetect.youtube);
                await interaction.update({ components: [await broadcastButtons(guildId)] });
                return;
            case _1.RegisterButtonName.broadcast_twitch:
                await ServerRepository_1.default.updateDetectInfo(guildId, interaction.channelId, DetectType_1.DetectType.Broadcast, DetectType_1.DetectPlatform.Twitch, !info.broadcastDetect.twitch);
                await interaction.update({ components: [await broadcastButtons(guildId)] });
                return;
            case _1.RegisterButtonName.new_post_chzzk:
                await ServerRepository_1.default.updateDetectInfo(guildId, interaction.channelId, DetectType_1.DetectType.NewPost, DetectType_1.DetectPlatform.Chzzk, !info.newPostDetect.chzzk);
                await interaction.update({ components: [await newPostButtons(guildId)] });
                return;
            case _1.RegisterButtonName.new_post_afreeca:
                await ServerRepository_1.default.updateDetectInfo(guildId, interaction.channelId, DetectType_1.DetectType.NewPost, DetectType_1.DetectPlatform.Afreeca, !info.newPostDetect.afreeca);
                await interaction.update({ components: [await newPostButtons(guildId)] });
                return;
            case _1.RegisterButtonName.new_post_youtube:
                await ServerRepository_1.default.updateDetectInfo(guildId, interaction.channelId, DetectType_1.DetectType.NewPost, DetectType_1.DetectPlatform.Youtube, !info.newPostDetect.youtube);
                await interaction.update({ components: [await newPostButtons(guildId)] });
                return;
            case _1.RegisterButtonName.owner_chat_chzzk:
                await ServerRepository_1.default.updateDetectInfo(guildId, interaction.channelId, DetectType_1.DetectType.OwnerChat, DetectType_1.DetectPlatform.Chzzk, !info.ownerChatDetect.chzzk);
                await interaction.update({ components: [await ownerChatButtons(guildId)] });
                return;
            case _1.RegisterButtonName.owner_chat_afreeca:
                await ServerRepository_1.default.updateDetectInfo(guildId, interaction.channelId, DetectType_1.DetectType.OwnerChat, DetectType_1.DetectPlatform.Afreeca, !info.ownerChatDetect.afreeca);
                await interaction.update({ components: [await ownerChatButtons(guildId)] });
                return;
            case _1.RegisterButtonName.owner_chat_youtube:
                await ServerRepository_1.default.updateDetectInfo(guildId, interaction.channelId, DetectType_1.DetectType.OwnerChat, DetectType_1.DetectPlatform.Youtube, !info.ownerChatDetect.youtube);
                await interaction.update({ components: [await ownerChatButtons(guildId)] });
                return;
            case _1.RegisterButtonName.else_naver_cafe:
                await ServerRepository_1.default.updateDetectInfo(guildId, interaction.channelId, DetectType_1.DetectType.Else, DetectType_1.DetectPlatform.NaverCafe, !info.elseDetect.naverCafe);
                await interaction.update({ components: [await elseButtons(guildId)] });
                return;
            default:
                break;
        }
    }
};
const initialButtons = () => {
    return new discord_js_1.ActionRowBuilder()
        .addComponents(makeButton(_1.RegisterButtonName.broadcast, true), makeButton(_1.RegisterButtonName.new_post, true), makeButton(_1.RegisterButtonName.owner_chat, false), makeButton(_1.RegisterButtonName.else, false));
};
const broadcastButtons = async (guildId) => {
    const info = await ServerRepository_1.default.getDetectInfo(guildId);
    return new discord_js_1.ActionRowBuilder()
        .addComponents(makeButton(_1.RegisterButtonName.broadcast_chzzk, info.broadcastDetect.chzzk), makeButton(_1.RegisterButtonName.broadcast_afreeca, info.broadcastDetect.afreeca), makeButton(_1.RegisterButtonName.broadcast_youtube, info.broadcastDetect.youtube), makeButton(_1.RegisterButtonName.broadcast_twitch, info.broadcastDetect.twitch), makeButton(_1.RegisterButtonName.back, true, true));
};
const newPostButtons = async (guildId) => {
    const info = await ServerRepository_1.default.getDetectInfo(guildId);
    return new discord_js_1.ActionRowBuilder()
        .addComponents(makeButton(_1.RegisterButtonName.new_post_chzzk, info.newPostDetect.chzzk), makeButton(_1.RegisterButtonName.new_post_afreeca, info.newPostDetect.afreeca), makeButton(_1.RegisterButtonName.new_post_youtube, info.newPostDetect.youtube), makeButton(_1.RegisterButtonName.back, true, true));
};
const ownerChatButtons = async (guildId) => {
    const info = await ServerRepository_1.default.getDetectInfo(guildId);
    return new discord_js_1.ActionRowBuilder()
        .addComponents(makeButton(_1.RegisterButtonName.owner_chat_chzzk, info.ownerChatDetect.chzzk), makeButton(_1.RegisterButtonName.owner_chat_afreeca, info.ownerChatDetect.afreeca), makeButton(_1.RegisterButtonName.owner_chat_youtube, info.ownerChatDetect.youtube), makeButton(_1.RegisterButtonName.back, true, true));
};
const elseButtons = async (guildId) => {
    const info = await ServerRepository_1.default.getDetectInfo(guildId);
    return new discord_js_1.ActionRowBuilder()
        .addComponents(makeButton(_1.RegisterButtonName.else_naver_cafe, info.elseDetect.naverCafe), makeButton(_1.RegisterButtonName.back, true, true));
};
function makeButton(name, setActive, isBack) {
    return new discord_js_1.ButtonBuilder()
        .setCustomId(_1.CommandName.DetectButton + ":" + name)
        .setLabel(commandText.titleMap[name])
        .setStyle(isBack ? discord_js_1.ButtonStyle.Danger : (setActive ? discord_js_1.ButtonStyle.Primary : discord_js_1.ButtonStyle.Secondary));
}
//# sourceMappingURL=detect.js.map