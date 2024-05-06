"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solveNoticeChannelButtons = exports.noticeChannelDropdown = exports.noticeChannel = void 0;
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
        const guild = interaction.guild;
        let options = makeDropdown(guild);
        let hasNext = options.length > 20;
        // 만약 옵션이 20개 이상이라면 버튼 추가
        // current page 0 when init
        let buttons = makeButton(0, hasNext);
        if (hasNext) {
            options = options.slice(0, 20);
        }
        const selectMenu = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId(_1.CommandName.NoticeChannelDropdown)
            .setPlaceholder('채널을 선택해 주세요!')
            .addOptions(options);
        const dropdown = new discord_js_1.ActionRowBuilder()
            .addComponents(selectMenu);
        await interaction.reply({ content: '채널을 선택해 주세요!', components: [dropdown, buttons] });
    }
};
exports.noticeChannelDropdown = {
    command: _1.CommandName.NoticeChannelDropdown,
    execute: async (interaction) => {
        await ServerRepository_1.default.setNoticeChannel(interaction.guild, interaction.values[0]);
        await interaction.update({ content: '채널 설정이 완료되었습니다.', components: [] });
    }
};
exports.solveNoticeChannelButtons = {
    command: _1.CommandName.NoticeChannelButton,
    execute: async (interaction) => {
        const guild = interaction.guild;
        const page = parseInt(interaction.customId.split(":")[1]);
        let options = makeDropdown(guild);
        let hasNext = options.length > (page + 1) * 20;
        const buttons = makeButton(page, hasNext);
        options = options.slice(page * 20, (page + 1) * 20);
        const selectMenu = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId(_1.CommandName.NoticeChannelDropdown)
            .setPlaceholder('채널을 선택해 주세요!')
            .addOptions(options);
        const dropdown = new discord_js_1.ActionRowBuilder()
            .addComponents(selectMenu);
        await interaction.reply({ content: '채널을 선택해 주세요!', components: [dropdown, buttons] });
    }
};
const makeButton = (page, hasNext) => {
    let previousButton;
    if (page - 1 < 0) {
        previousButton = new discord_js_1.ButtonBuilder()
            .setCustomId(_1.CommandName.NoticeChannelButton + ":" + (page - 1) + ":cancel")
            .setLabel(commandText.titleMap[_1.NoticeButtonName.previous])
            .setStyle(discord_js_1.ButtonStyle.Secondary);
    }
    else {
        previousButton = new discord_js_1.ButtonBuilder()
            .setCustomId(_1.CommandName.NoticeChannelButton + ":" + (page - 1))
            .setLabel(commandText.titleMap[_1.NoticeButtonName.previous])
            .setStyle(discord_js_1.ButtonStyle.Primary);
    }
    let nextButton;
    if (hasNext) {
        nextButton = new discord_js_1.ButtonBuilder()
            .setCustomId(_1.CommandName.NoticeChannelButton + ":" + (page + 1))
            .setLabel(commandText.titleMap[_1.NoticeButtonName.next])
            .setStyle(discord_js_1.ButtonStyle.Primary);
    }
    else {
        nextButton = new discord_js_1.ButtonBuilder()
            .setCustomId(_1.CommandName.NoticeChannelButton + ":" + (page + 1) + ":cancel")
            .setLabel(commandText.titleMap[_1.NoticeButtonName.next])
            .setStyle(discord_js_1.ButtonStyle.Secondary);
    }
    return new discord_js_1.ActionRowBuilder()
        .addComponents(previousButton, nextButton);
};
const makeDropdown = (guild) => {
    const channels = guild.channels.cache.filter(channel => {
        return channel.isTextBased();
    }).map(channel => channel);
    return channels.map(channel => {
        let description = "";
        if (channel.parent) {
            let parentName = channel.parent.name;
            if (parentName.length > 15) {
                parentName = parentName.slice(0, 15) + "...";
            }
            description = "`" + parentName + "` 의 하위 채널";
        }
        // 각 필드 값이 빈 문자열인지 확인하고, 빈 문자열이면 "-"로 대체
        let channelName = channel.name === "" ? "-" : channel.name;
        let channelId = channel.id === "" ? "-" : channel.id;
        let channelparentName = description === "" ? "-" : description;
        if (channelName.length > 25) {
            console.error(`label length is over 25: ${channelName} in server ${guild.name}`);
            channelName = channelName.slice(0, 15) + "...";
        }
        if (channelparentName.length > 25) {
            console.error(`description length is over 25: ${channelparentName} in server ${guild.name}`);
        }
        if (channelId.length > 25) {
            console.error(`value length is over 25: ${channelId} in server ${guild.name}`);
            channelId = channelId.slice(0, 15) + "...";
        }
        return {
            label: channelName,
            value: channelId,
            description: channelparentName,
        };
    }).filter(option => option !== null);
};
//# sourceMappingURL=NoticeChannel.js.map