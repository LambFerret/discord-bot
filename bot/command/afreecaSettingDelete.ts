import { CommandInteraction, EmbedBuilder, SelectMenuComponentOptionData, SlashCommandBuilder } from "discord.js";
import { Command, CommandName, text } from ".";
import { DetectPlatform } from "../model/DetectType";
import ServerRepository from "../repository/ServerRepository";

const ID = CommandName.Afreeca_Setting_Delete;
const commandText = text[ID];

export const afreecaSettingDelete: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),

    execute: async (interaction: CommandInteraction) => {
        let embedMessage: EmbedBuilder = new EmbedBuilder();
        const setting = await ServerRepository.getServerSettings(interaction.guildId as string);
        const streamerID = await ServerRepository.getDetectID(interaction.guildId as string, DetectPlatform.Afreeca);


        if (streamerID === undefined) {
            embedMessage
                .setTitle(`아직 주인님의 아프리카 플랫폼 정보가 없어요!`)
                .setDescription(` /등록 으로 주인님의 정보를 등록해주세요!`)
                .setColor('#0099ff')

        } else {
            setting.afreecaNewPostOnlyAnnouncement = "";
            ServerRepository.updateServerSettings(interaction.guildId as string, setting);
            embedMessage
                .setTitle(`주인님의 모든 글을 알려줄게요!`)
                .setColor('#0099ff')
        }
        await interaction.reply({ embeds: [embedMessage] });
    }
}
