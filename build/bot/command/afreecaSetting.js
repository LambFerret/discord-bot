"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.afreecaSetting = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const _1 = require(".");
const DetectType_1 = require("../model/DetectType");
const ServerRepository_1 = tslib_1.__importDefault(require("../repository/ServerRepository"));
const BotConfig_1 = tslib_1.__importStar(require("../BotConfig"));
const ID = _1.CommandName.Afreeca_Setting;
const commandText = _1.text[ID];
const optionsText = commandText.options;
exports.afreecaSetting = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name)
        .addStringOption(option => option.setName(optionsText[0].label)
        .setDescription(optionsText[0].description || '설명이 없습니다.')
        .setRequired(true)),
    execute: async (interaction) => {
        let embedMessage;
        const value = interaction.options.get(optionsText[0].label)?.value;
        const setting = await ServerRepository_1.default.getServerSettings(interaction.guildId);
        const streamerID = await ServerRepository_1.default.getDetectID(interaction.guildId, DetectType_1.DetectPlatform.Afreeca);
        if (streamerID === "") {
            embedMessage = await BotConfig_1.default.makeEmbed(`아직 주인님의 SOOP (숲) 플랫폼 정보가 없어요!`, ` \`/등록\` 으로 주인님의 정보를 등록해주세요!`, BotConfig_1.MessageColor.Error, interaction.guildId);
        }
        else if (value === "없음") {
            setting.afreecaNewPostOnlyAnnouncement = "";
            ServerRepository_1.default.updateServerSettings(interaction.guildId, setting);
            embedMessage = await BotConfig_1.default.makeEmbed(`주인님의 모든 글을 알려줄게요!`, ``, BotConfig_1.MessageColor.Default, interaction.guildId);
        }
        else {
            setting.afreecaNewPostOnlyAnnouncement = value;
            ServerRepository_1.default.updateServerSettings(interaction.guildId, setting);
            embedMessage = await BotConfig_1.default.makeEmbed(`이 게시판의 글만 알려줄게요!`, "링크 : \n" + `https://bj.afreecatv.com/${streamerID}/posts/${value} \n`, BotConfig_1.MessageColor.Confirm, interaction.guildId);
        }
        await interaction.reply({ embeds: [embedMessage] });
    }
};
//# sourceMappingURL=afreecaSetting.js.map