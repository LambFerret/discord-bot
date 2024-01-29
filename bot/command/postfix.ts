import { SlashCommandBuilder, CommandInteraction, BaseInteraction, Locale, EmbedBuilder, SelectMenuComponentOptionData } from "discord.js";
import { Command, text, CommandName } from ".";
import serverService from "../service/ServerService";

const ID = CommandName.Postfix;
const commandText = text[ID];
const selectMenu = (commandText.options as SelectMenuComponentOptionData[])[0];

const postfix: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization(Locale.Korean, commandText.name)
        .addStringOption(option =>
            option.setName(selectMenu.label)
                .setDescription(selectMenu?.description || '설명이 없습니다.')
                .setRequired(false)) as SlashCommandBuilder

    ,
    execute: async (interaction: CommandInteraction) => {
        const postfix = interaction.options.get(commandText.name)?.value as string;
        const guildId = interaction.guildId as string;

        if (postfix === '') {
            serverService.updateGuildPrefix(guildId, "", false);
            await interaction.reply(`난 이제 말투가 없습니다! \n`);
        } else {
            serverService.updateGuildPrefix(guildId, postfix, false);
            await interaction.reply(`접미사가 바뀌었습니다! \n` + `앞으로 제 말투는 <<${postfix}>> 입니다!`);
        }
    }
}

export default postfix;