import { SlashCommandBuilder, StringSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, SelectMenuComponentOptionData, CommandInteraction, Guild } from "discord.js";
import { Command, CommandName, DropdownCommand, text } from ".";
import ServerRepository from "../repository/ServerRepository";

const ID = CommandName.NoticeChannel;
const commandText = text[ID];

export const noticeChannel : Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),
    execute: async (interaction: StringSelectMenuInteraction) => {
        const dropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(makeChannelSelectMenu(interaction.guild as Guild));
        await interaction.reply({ content: 'Please select an option:', components: [dropdown] });
    }
}

export const noticeChannelDropdown :DropdownCommand = {
    command: CommandName.NoticeChannelDropdown,
    execute: async (interaction: StringSelectMenuInteraction) => {
        await ServerRepository.setNoticeChannel(interaction.guild as Guild, interaction.values[0]);
        await interaction.update({ content: '설정이 완료되었습니다.' });
    }
}

const makeChannelSelectMenu = (guild: Guild): StringSelectMenuBuilder => {
    // get all channel names and ids
    const channels = guild.channels.cache.filter(channel => channel.isTextBased()).map(channel => channel);

    // make options
    const options = channels.map(channel => {
        return {
            label: channel.name,
            value: channel.id,
            description: "Text Channel"
        }
    });

    // make select menu
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(CommandName.NoticeChannelDropdown)
        .setPlaceholder('Nothing selected')
        .addOptions(options);

    return selectMenu;

}