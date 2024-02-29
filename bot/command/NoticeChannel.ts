import { SlashCommandBuilder, StringSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, SelectMenuComponentOptionData, CommandInteraction, Guild } from "discord.js";
import { Command, CommandName, DropdownCommand, text } from ".";
import ServerRepository from "../repository/ServerRepository";

const ID = CommandName.NoticeChannel;
const commandText = text[ID];

export const noticeChannel: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),
    execute: async (interaction: StringSelectMenuInteraction) => {
        const dropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(makeChannelSelectMenu(interaction.guild as Guild));
        await interaction.reply({ content: '채널을 선택해 주세요!', components: [dropdown] });
    }
}

export const noticeChannelDropdown: DropdownCommand = {
    command: CommandName.NoticeChannelDropdown,
    execute: async (interaction: StringSelectMenuInteraction) => {
        await ServerRepository.setNoticeChannel(interaction.guild as Guild, interaction.values[0]);
        await interaction.update({ content: '채널 설정이 완료되었습니다.', components: [] });
    }
}

const makeChannelSelectMenu = (guild: Guild): StringSelectMenuBuilder => {
    const channels = guild.channels.cache.filter(channel => {
        return channel.isTextBased()
    }).map(channel => channel);

    const options = channels.map(channel => {
        let description = "";
        if (channel.parent) description = "`" + channel.parent.name + "` 의 하위 채널";

        // 각 필드 값이 빈 문자열인지 확인하고, 빈 문자열이면 "-"로 대체
        const label = channel.name === "" ? "-" : channel.name;
        const value = channel.id === "" ? "-" : channel.id;
        const descriptionFinal = description === "" ? "-" : description;

        return {
            label: label,
            value: value,
            description: descriptionFinal,
        };

    });

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(CommandName.NoticeChannelDropdown)
        .setPlaceholder('채널을 선택해 주세요!')
        .addOptions(options);

    return selectMenu;

}