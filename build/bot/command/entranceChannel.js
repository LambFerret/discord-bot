"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entranceChannelDropdown = exports.entranceChannel = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const _1 = require(".");
const ServerRepository_1 = tslib_1.__importDefault(require("../repository/ServerRepository"));
const ID = _1.CommandName.EntranceChannel;
const commandText = _1.text[ID];
exports.entranceChannel = {
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
exports.entranceChannelDropdown = {
    command: _1.CommandName.EntranceChannelDropdown,
    execute: async (interaction) => {
        const entranceInfo = await ServerRepository_1.default.getEntranceInfo(interaction.guildId);
        if (entranceInfo.messageId !== "") {
            const entranceChannel = interaction.guild?.channels.cache.get(entranceInfo.entranceChannelId);
            if (entranceChannel && entranceChannel.isTextBased()) {
                try {
                    const message = await entranceChannel.messages.fetch(entranceInfo.messageId);
                    if (message) {
                        message.delete();
                    }
                }
                catch (error) {
                    console.error("message already deleted error");
                }
            }
        }
        await ServerRepository_1.default.setEntranceChannel(interaction.guild, interaction.values[0]);
        entranceInfo.entranceChannelId = interaction.values[0];
        await interaction.update({ content: '설정이 완료되었습니다.', components: [] });
        const entranceChannel = interaction.guild?.channels.cache.get(entranceInfo.entranceChannelId);
        if (entranceChannel && entranceChannel.isTextBased()) {
            const message = await entranceChannel.send(`${entranceInfo.quote}`);
            if (message) {
                ServerRepository_1.default.saveEntranceMessageId(interaction.guildId, message.id);
                message.react(entranceInfo.emoji);
            }
            else {
                await interaction.update({ content: "예상치 못한 오류가 발생했어요 ", components: [] });
            }
        }
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
        .setCustomId(_1.CommandName.EntranceChannelDropdown)
        .setPlaceholder('채널을 선택해 주세요!')
        .addOptions(options);
    return selectMenu;
};
//# sourceMappingURL=entranceChannel.js.map