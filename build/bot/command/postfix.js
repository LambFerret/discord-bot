"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const _1 = require(".");
const BotConfig_1 = tslib_1.__importStar(require("../BotConfig"));
const ServerService_1 = tslib_1.__importDefault(require("../service/ServerService"));
const ID = _1.CommandName.Postfix;
const commandText = _1.text[ID];
const selectMenu = commandText.options[0];
const postfix = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization(discord_js_1.Locale.Korean, commandText.name)
        .addStringOption(option => option.setName(selectMenu.label)
        .setDescription(selectMenu?.description || '설명이 없습니다.')
        .setRequired(false)),
    execute: async (interaction) => {
        const postfix = interaction.options.get(commandText.name)?.value;
        const guildId = interaction.guildId;
        if (postfix === '없음') {
            ServerService_1.default.updateGuildPostfix(guildId, "");
            const embed = await BotConfig_1.default.makeEmbed(`말투를 없앴습니다!`, "(ง •̀_•́)ง", BotConfig_1.MessageColor.Confirm, guildId);
            await interaction.reply({ embeds: [embed] });
        }
        else {
            ServerService_1.default.updateGuildPostfix(guildId, postfix);
            const embed = await BotConfig_1.default.makeEmbed(`접미사가 바뀌었습니다! \n`, `앞으로 제 말투는 <<${postfix}>> 입니다!`, BotConfig_1.MessageColor.Confirm, guildId);
            await interaction.reply({ embeds: [embed] });
        }
    }
};
exports.default = postfix;
//# sourceMappingURL=postfix.js.map