"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const _1 = require(".");
const ServerRepository_1 = tslib_1.__importDefault(require("../repository/ServerRepository"));
const ID = _1.CommandName.Initialize;
const commandText = _1.text[ID];
const initialize = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),
    execute: async (interaction) => {
        await ServerRepository_1.default.deleteServer(interaction.guildId);
        await ServerRepository_1.default.createNewServer(interaction.guild);
        await interaction.reply({ content: '초기화' });
    }
};
exports.default = initialize;
//# sourceMappingURL=initalize.js.map