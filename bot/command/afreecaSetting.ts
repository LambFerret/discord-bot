import { CommandInteraction, SelectMenuComponentOptionData, SlashCommandBuilder } from "discord.js";
import { Command, CommandName, text } from ".";
import { DetectPlatform } from "../model/DetectType";
import ServerRepository from "../repository/ServerRepository";
import { EmbedBuilder } from "@discordjs/builders";
import BotConfig, { MessageColor } from "../BotConfig";

const ID = CommandName.Afreeca_Setting;
const commandText = text[ID];
const optionsText = commandText.options as SelectMenuComponentOptionData[];

export const afreecaSetting: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name)
        .addStringOption(option =>
            option.setName(optionsText[0].label)
                .setDescription(optionsText[0].description || '설명이 없습니다.')
                .setRequired(true)) as SlashCommandBuilder,

    execute: async (interaction: CommandInteraction) => {
        let embedMessage: EmbedBuilder
        const value = interaction.options.get(optionsText[0].label)?.value as string;
        const setting = await ServerRepository.getServerSettings(interaction.guildId as string);
        const streamerID = await ServerRepository.getDetectID(interaction.guildId as string, DetectPlatform.Afreeca);

        if (streamerID === "") {
            embedMessage = await BotConfig.makeEmbed(
                `아직 주인님의 아프리카 플랫폼 정보가 없어요!`,
                ` \`/등록\` 으로 주인님의 정보를 등록해주세요!`,
                MessageColor.Error,
                interaction.guildId as string
            );
        } else if (value === "없음") {
            setting.afreecaNewPostOnlyAnnouncement = "";
            ServerRepository.updateServerSettings(interaction.guildId as string, setting);
            embedMessage = await BotConfig.makeEmbed(
                `주인님의 모든 글을 알려줄게요!`,
                ``,
                MessageColor.Default,
                interaction.guildId as string
            );
        } else {
            setting.afreecaNewPostOnlyAnnouncement = value;
            ServerRepository.updateServerSettings(interaction.guildId as string, setting);
            embedMessage = await BotConfig.makeEmbed(
                `이 게시판의 글만 알려줄게요!`,
                "링크 : \n" + `https://bj.afreecatv.com/${streamerID}/posts/${value} \n`,
                MessageColor.Confirm,
                interaction.guildId as string
            );

        }
        await interaction.reply({ embeds: [embedMessage] });
    }
}
