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
        await interaction.update({ content: '채널 설정이 완료되었습니다.', components: [] });
    }
};
const makeChannelSelectMenu = (guild) => {
    const channels = guild.channels.cache.filter(channel => {
        return channel.isTextBased();
    }).map(channel => channel);
    const options = channels.map(channel => {
        let description = "";
        if (channel.parent) {
            let parentName = channel.parent.name;
            if (parentName.length > 15) {
                parentName = parentName.slice(0, 15) + "...";
            }
            description = "`" + parentName + "` 의 하위 채널";
        }
        // 각 필드 값이 빈 문자열인지 확인하고, 빈 문자열이면 "-"로 대체
        let channelName = channel.name;
        if (channelName.length > 15) {
            channelName = channelName.slice(0, 15) + "...";
        }
        let label = channel.name === "" ? "-" : channelName;
        let value = channel.id === "" ? "-" : channel.id;
        let descriptionFinal = description === "" ? "-" : description;
        if (label.length > 25) {
            console.error(`label length is over 25: ${label} in server ${guild.name}`);
            label = label.slice(0, 15) + "...";
        }
        if (descriptionFinal.length > 25) {
            console.error(`description length is over 25: ${descriptionFinal} in server ${guild.name}`);
            descriptionFinal = descriptionFinal.slice(0, 15) + "...";
        }
        if (value.length > 25) {
            console.error(`value length is over 25: ${value} in server ${guild.name}`);
            value = value.slice(0, 15) + "...";
        }
        return {
            label: label,
            value: value,
            description: descriptionFinal,
        };
    }).filter(option => option !== null);
    const selectMenu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId(_1.CommandName.NoticeChannelDropdown)
        .setPlaceholder('채널을 선택해 주세요!')
        .addOptions(options);
    return selectMenu;
};
//# sourceMappingURL=NoticeChannel.js.map