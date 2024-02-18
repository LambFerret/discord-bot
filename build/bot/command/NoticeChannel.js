"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noticeChannelDropdown = exports.noticeChannel = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const _1 = require(".");
const ServerRepository_1 = tslib_1.__importDefault(require("../repository/ServerRepository"));
const ID = _1.CommandName.NoticeChannel;
const commandText = _1.text[ID];
exports.noticeChannel = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),
    execute: async (interaction) => {
        const dropdown = new discord_js_1.ActionRowBuilder()
            .addComponents(makeChannelSelectMenu(interaction.guild));
        await interaction.reply({ content: '채널을 선택해 주세요!', components: [dropdown] });
    }
};
exports.noticeChannelDropdown = {
    command: _1.CommandName.NoticeChannelDropdown,
    execute: async (interaction) => {
        await ServerRepository_1.default.setNoticeChannel(interaction.guild, interaction.values[0]);
        await interaction.update({ content: '설정이 완료되었습니다.', components: [] });
    }
};
const makeChannelSelectMenu = (guild) => {
    const channels = guild.channels.cache.filter(channel => {
        return channel.isTextBased();
    }).map(channel => channel);
    const options = channels.map(channel => {
        let description = "";
        if (channel.parent)
            description = "\`" + channel.parent.name + "\` 의 하위 채널";
        return {
            label: channel.name,
            value: channel.id,
            description: description,
        };
    });
    const selectMenu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId(_1.CommandName.NoticeChannelDropdown)
        .setPlaceholder('채널을 선택해 주세요!')
        .addOptions(options);
    return selectMenu;
};
//# sourceMappingURL=NoticeChannel.js.map