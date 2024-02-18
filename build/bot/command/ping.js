"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const _1 = require(".");
const BotConfig_1 = tslib_1.__importStar(require("../BotConfig"));
const ID = _1.CommandName.Ping;
const commandText = _1.text[ID];
const ping = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization(discord_js_1.Locale.Korean, commandText.name),
    execute: async (interaction) => {
        const ping = interaction.client.ws.ping;
        const responseEmbed = await BotConfig_1.default.makeEmbed("Pong!", `지연 시간 : ${ping}ms \n 현재 시각 : ${new Date()}`, BotConfig_1.MessageColor.Default, interaction.guildId);
        await interaction.reply({ embeds: [responseEmbed] });
    }
};
exports.default = ping;
//# sourceMappingURL=ping.js.map