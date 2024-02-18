"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entrancePermissionDropdown = exports.entrancePermission = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const _1 = require(".");
const ServerRepository_1 = tslib_1.__importDefault(require("../repository/ServerRepository"));
const ID = _1.CommandName.EntrancePermission;
const commandText = _1.text[ID];
exports.entrancePermission = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),
    execute: async (interaction) => {
        const dropdown = new discord_js_1.ActionRowBuilder()
            .addComponents(makePermissionSelectMenu(interaction.guild));
        await interaction.reply({ content: '기본으로 지급할 역할을 선택해 주세요!', components: [dropdown] });
    }
};
exports.entrancePermissionDropdown = {
    command: _1.CommandName.EntrancePermissionDropdown,
    execute: async (interaction) => {
        await ServerRepository_1.default.updateGuildEntranceRole(interaction.guildId, interaction.values[0]);
        await interaction.update({ content: '역할 설정이 완료되었습니다.', components: [] });
    }
};
const makePermissionSelectMenu = (guild) => {
    const roleNames = guild.roles.cache.map(role => role.name);
    const options = roleNames.map(roleName => {
        return {
            label: roleName,
            value: roleName,
            description: "Role"
        };
    });
    const selectMenu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId(_1.CommandName.EntrancePermissionDropdown)
        .setPlaceholder('역할을 선택해 주세요!')
        .addOptions(options);
    return selectMenu;
};
//# sourceMappingURL=entrancePermission.js.map