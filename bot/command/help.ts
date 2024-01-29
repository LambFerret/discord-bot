import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, EmbedBuilder, SelectMenuComponentOptionData } from "discord.js";
import { Command, CommandName, DropdownCommand, text } from ".";
const ID = CommandName.Help;
const commandText = text[ID];

export const help: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),
    execute: async (interaction: StringSelectMenuInteraction) => {
        const dropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(helpDropdown.command)
                    .setPlaceholder('Nothing selected')
                    .addOptions(text[CommandName.HelpDropdown].options as SelectMenuComponentOptionData[]),
            );
        await interaction.reply({ content: 'Please select an option:', components: [dropdown] });
    }
}

export const helpDropdown: DropdownCommand = {
    command: CommandName.HelpDropdown,
    execute: async (interaction: StringSelectMenuInteraction) => {
        let responseEmbed;

        text[CommandName.HelpDropdown].options?.forEach((option) => {
            if (option.value === interaction.values[0]) {
                responseEmbed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(option.label)
                    .setDescription(option.description || '설명이 없습니다.');
            }
        });

        if (responseEmbed) {
            await interaction.update({
                embeds: [responseEmbed],
                components: [interaction.message.components[0]]
            });
        }
    }
}
