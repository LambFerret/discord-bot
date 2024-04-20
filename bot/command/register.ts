import {
    ActionRowBuilder, BaseInteraction, ButtonBuilder, ButtonInteraction, ButtonStyle,
    CommandInteraction, SelectMenuComponentOptionData, SlashCommandBuilder,
    StringSelectMenuBuilder, StringSelectMenuInteraction
} from "discord.js";
import { ButtonCommand, Command, CommandName, DropdownCommand, text } from ".";
import BotConfig, { MessageColor } from "../BotConfig";
import api from "../ExternalAPI";
import { DetectPlatform } from "../model/DetectType";
import { YoutubeChannelInfoType } from "../model/YoutubeChannelInfoType";
import ServerRepository from "../repository/ServerRepository";
import { EmbedBuilder } from "@discordjs/builders";

const ID = CommandName.Register;
const commandText = text[ID];
const optionsText = commandText.options as SelectMenuComponentOptionData[];

const choices = [
    { name: "치지직", value: DetectPlatform.Chzzk },
    { name: "아프리카", value: DetectPlatform.Afreeca },
    { name: "유튜브", value: DetectPlatform.Youtube },
    { name: "트위치", value: DetectPlatform.Twitch }
];

export const register: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name)
        .addStringOption(option =>
            option.setName(optionsText[0].label)
                .setDescription(optionsText[0].description || '설명이 없습니다.')
                .addChoices(...choices)
                .setRequired(true))
        .addStringOption(option =>
            option.setName(optionsText[1].label)
                .setDescription(optionsText[1].description || '설명이 없습니다.')
                .setMaxLength(100)
                .setRequired(true)) as SlashCommandBuilder,

    execute: async (interaction: CommandInteraction) => {
        const platform = DetectPlatform[interaction.options.get(optionsText[0].label)?.value as keyof typeof DetectPlatform];
        const platformKoreanName = choices.find(choice => choice.value === platform)?.name;
        const id = interaction.options.get(optionsText[1].label)?.value as string;
        let embedMessage: EmbedBuilder;
        let isError: boolean = false;
        let name: string = "";
        switch (platform) {
            case DetectPlatform.Chzzk:
                const info = await api.getChzzkLiveInfo(id);
                if (info === undefined) isError = true;
                else name = info?.channelName;
                break;
            case DetectPlatform.Afreeca:
                const info2 = await api.getAfreecaLiveInfo(id);
                if (info2 === undefined) isError = true;
                else name = info2?.user_nick;

                break;
            case DetectPlatform.Youtube:
                solveYoutube(interaction, id);
                return;
            case DetectPlatform.Twitch:
                const info4 = await api.getTwitchLiveInfo(id);
                if (info4 === undefined) isError = true;
                else name = info4?.user_name;
                break;
        }

        if (isError) {
            embedMessage = await BotConfig.makeEmbed(
                `${platformKoreanName} 에서 아이디 \`${id}\` 를 찾을 수 없어요 (｡•́︿•̀｡) `,
                `
                **아이디를 다시 확인해주세요!**
                
                *예시*
                - 치지직: \`bb382c2c0cc9fa7c86ab3b037fb5799c\`\n
                - 아프리카: \`maruko86\`\n
                - 유튜브: \`침투부\`\n
                - 트위치: \`zilioner\`\n`,
                MessageColor.Error,
                interaction.guildId as string
            )
        } else {
            ServerRepository.updateDetectID(interaction.guildId as string, platform, id);
            const nameIHave = name ? `${name}` : id;
            embedMessage = await BotConfig.makeEmbed(
                `${platformKoreanName} 에서 \`${nameIHave}\` 님을 등록하였습니다!`,
                " (ง •̀_•́)ง",
                MessageColor.Confirm,
                interaction.guildId as string
            )
        }
        await interaction.reply({ embeds: [embedMessage] });
    }
}

export const registerYoutube: DropdownCommand = {
    command: CommandName.RegisterYoutube,
    execute: async (interaction: StringSelectMenuInteraction) => {
        const selectedChannelId = interaction.values[0].split(":")[0];
        console.log(selectedChannelId);
        const channelInfo = await api.searchYoutubeByChannelID(selectedChannelId);

        if (!channelInfo) {
            // TODO 없어요 ㅠ
            return;
        }

        const embed = await BotConfig.makeEmbed(`유튜브 채널 \`${channelInfo.channelTitle}\` 가 맞으신가요?`,
            `*${channelInfo.description}*`,
            MessageColor.Default,
            interaction.guildId as string);
        embed
            .setThumbnail(channelInfo.thumbnail)
        // .setURL("https://www.youtube.com/" + channelInfo.url)

        const confirmButton = new ButtonBuilder()
            .setCustomId(regiesterYoutubeConfirmButton.command + ":" + selectedChannelId + ":" + "confirm")
            .setLabel('맞아')
            .setStyle(ButtonStyle.Primary);
        const cancelButton = new ButtonBuilder()
            .setCustomId(regiesterYoutubeConfirmButton.command + ":" + interaction.values[0].split(":")[1] + ":" + "cancel")
            .setLabel('돌아가기')
            .setStyle(ButtonStyle.Danger);

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(confirmButton, cancelButton);

        await interaction.update({ embeds: [embed], components: [actionRow] });

    }
}

export const regiesterYoutubeConfirmButton: ButtonCommand = {
    command: CommandName.RegisterYoutubeConfirmButton,
    execute: async (interaction: ButtonInteraction) => {
        if (interaction.customId.split(":")[2] === "confirm") {
            const selectedChannelId = interaction.customId.split(":")[1];
            ServerRepository.updateDetectID(interaction.guildId as string, DetectPlatform.Youtube, selectedChannelId);
            const embedMessage = await BotConfig.makeEmbed(`정상적으로 등록되었습니다!`, " (ง •̀_•́)ง", MessageColor.Confirm, interaction.guildId as string);
            await interaction.update({ embeds: [embedMessage], components: [], content: "" });
        } else if (interaction.customId.split(":")[2] === "cancel") {
            const customData = interaction.customId.split(":")[1];
            if (customData) await solveYoutube(interaction, customData);
        } else {
            // TODO error
            await interaction.update({ content: "에러가 발생했습니다. 다시 시도해주세요!", components: [] });
        }
    }
}


const solveYoutube = async (interaction: BaseInteraction, channelTitle: string) => {
    const youtubeInfos: YoutubeChannelInfoType[] = await api.searchYoutubeChannelIDWithTitle(channelTitle);
    const options = youtubeInfos.map((info) => {
        return {
            label: info.channelTitle,
            description: info.description,
            value: info.id + ":" + info.channelTitle
        }
    });

    const dropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(registerYoutube.command)
                .setPlaceholder('선택해주세요.')
                .addOptions(options as SelectMenuComponentOptionData[]),
        );
    if (interaction.isCommand())
        await interaction.reply({ components: [dropdown] });
    if (interaction.isButton()) {
        await interaction.update({ components: [dropdown], embeds: [] });
    }
}