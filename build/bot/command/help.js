"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = void 0;
const discord_js_1 = require("discord.js");
const _1 = require(".");
const MessageFormat_1 = require("../MessageFormat");
const ID = _1.CommandName.Help;
const commandText = _1.text[ID];
exports.help = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),
    execute: async (interaction) => {
        if (interaction.member && interaction.member instanceof discord_js_1.GuildMember) {
            (0, MessageFormat_1.introduceBotWithDM)(interaction.member);
        }
        interaction.reply({ content: "DM으로 도움말을 보내드렸어요!", ephemeral: true });
    }
};
//# sourceMappingURL=help.js.map