import { CommandInteraction, Locale, SelectMenuComponentOptionData, SlashCommandBuilder } from "discord.js";
import { Command, CommandName, text } from ".";
import BotConfig, { MessageColor } from "../BotConfig";
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

        if (postfix === '없음') {
            serverService.updateGuildPostfix(guildId, "");
            const embed = await BotConfig.makeEmbed(`말투를 없앴습니다!`, "(ง •̀_•́)ง", MessageColor.Confirm, guildId);
            await interaction.reply({ embeds: [embed] });
        } else {
            serverService.updateGuildPostfix(guildId, postfix);
            const embed = await BotConfig.makeEmbed(`접미사가 바뀌었습니다! \n`, `앞으로 제 말투는 <<${postfix}>> 입니다!`, MessageColor.Confirm, guildId);
            await interaction.reply({ embeds: [embed] });
        }
    }
}

export default postfix;