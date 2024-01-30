import { CommandInteraction, EmbedBuilder, SelectMenuComponentOptionData, SlashCommandBuilder } from "discord.js";
import { Command, CommandName, text } from ".";
import api from "../ExternalAPI";
import { DetectPlatform } from "../model/DetectType";
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

const register: Command = {
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
                embedMessage = new EmbedBuilder()
                    .setTitle(`플랫폼 ${platformKoreanName} 는 아직 지원하지 않습니다  (\´;︵;\`)`)
                    .setColor('#0099ff')
                    .setFooter({ text: " ..." + postfix })

                await interaction.reply({ embeds: [embedMessage] });
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
                    - 유튜브: \`@ChimChakMan_Official\`\n
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

export default register;