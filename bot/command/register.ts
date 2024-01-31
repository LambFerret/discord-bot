import { ActionRowBuilder, BaseInteraction, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, EmbedBuilder, SelectMenuComponentOptionData, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { ButtonCommand, Command, CommandName, DropdownCommand, text } from ".";
import api from "../ExternalAPI";
import { DetectPlatform } from "../model/DetectType";
import { YoutubeChannelInfoType } from "../model/youtubeChannelInfoType";
import ServerRepository from "../repository/ServerRepository";

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
        const postfix = await ServerRepository.getServerPostfix(interaction.guildId as string);
        let embedMessage: EmbedBuilder;
        let isError: boolean = false;

        switch (platform) {
            case DetectPlatform.Chzzk:
                const info = await api.getChzzkLiveInfo(id);
                if (info === undefined) isError = true;
                break;
            case DetectPlatform.Afreeca:
                const info2 = await api.getAfreecaLiveInfo(id);
                if (info2 === undefined) isError = true;
                break;
            case DetectPlatform.Youtube:
                solveYoutube(interaction, id);
                return;
            case DetectPlatform.Twitch:
                const info4 = await api.getTwitchLiveInfo(id);
                if (info4 === undefined) isError = true;
                break;
        }

        if (isError) {
            embedMessage = new EmbedBuilder()
                .setTitle(`${platformKoreanName} 에서 \`${id}\` 주인님을 찾을 수 없어요 (｡•́︿•̀｡) `)
                .setDescription(`
                    **아이디를 다시 확인해주세요!**
                    
                    *예시*
                    - 치지직: \`bb382c2c0cc9fa7c86ab3b037fb5799c\`\n
                    - 아프리카: \`maruko86\`\n
                    - 유튜브: \`침투부\`\n
                    - 트위치: \`zilioner\`\n
                `)
                .setColor('#FF0000')
                .setFooter({ text: " ..." + postfix })
        } else {
            ServerRepository.updateDetectID(interaction.guildId as string, platform, id);
            embedMessage = new EmbedBuilder()
                .setTitle(`${platformKoreanName} 에서  \`${id}\` 주인님이 등록되었습니다! (ง •̀_•́)ง`)
                .setColor('#0099ff')
                .setFooter({ text: " ..." + postfix })
        }
        await interaction.reply({ embeds: [embedMessage] });
    }
}

export const registerYoutube: DropdownCommand = {
    command: CommandName.RegisterYoutube,
    execute: async (interaction: StringSelectMenuInteraction) => {
        const selectedChannelId = interaction.values[0].split(":")[0];
        const channelInfo = await api.searchYoutubeByChannelID(selectedChannelId);

        if (!channelInfo) {
            // TODO 없어요 ㅠ
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`유튜브 채널 \`${channelInfo.channelTitle}\` 가 맞으신가요?`)
            .setDescription(channelInfo.description)
            .setThumbnail(channelInfo.thumbnail)
            .setURL("https://www.youtube.com/" + channelInfo.url)
            .setColor('#0099ff');

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
            const postfix = await ServerRepository.getServerPostfix(interaction.guildId as string);
            const embedMessage = new EmbedBuilder()
                .setTitle(`정상적으로 등록되었습니다! (ง •̀_•́)ง`)
                .setColor('#0099ff')
                .setFooter({ text: " ..." + postfix })
            await interaction.update({ embeds: [embedMessage], components: [], content: ""});
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
                .setPlaceholder('Nothing selected')
                .addOptions(options as SelectMenuComponentOptionData[]),
        );
    if (interaction.isCommand())
        await interaction.reply({ content: 'IS COMMAND OPTION', components: [dropdown] });
    if (interaction.isButton()) {
        await interaction.update({ content: 'IS BUTTON OPTION', components: [dropdown], embeds: [] });
    }
}