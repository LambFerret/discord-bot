import { SlashCommandBuilder, StringSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, SelectMenuComponentOptionData, CommandInteraction, Guild, ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";
import { ButtonCommand, Command, CommandName, DropdownCommand, NoticeButtonName, text } from ".";
import ServerRepository from "../repository/ServerRepository";

const ID = CommandName.NoticeChannel;
const commandText = text[ID];

export const noticeChannel: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),
    execute: async (interaction: StringSelectMenuInteraction) => {
        const guild = interaction.guild as Guild;

        let options = makeDropdown(guild);

        let hasNext: boolean = options.length > 20;

        // 만약 옵션이 20개 이상이라면 버튼 추가
        // current page 0 when init

        let buttons = makeButton(0, hasNext);

        if (hasNext) {
            options = options.slice(0, 20);
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(CommandName.NoticeChannelDropdown)
            .setPlaceholder('채널을 선택해 주세요!')
            .addOptions(options);

        const dropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(selectMenu);
        await interaction.reply({ content: '채널을 선택해 주세요!', components: [dropdown, buttons] });
    }
}

export const noticeChannelDropdown: DropdownCommand = {
    command: CommandName.NoticeChannelDropdown,
    execute: async (interaction: StringSelectMenuInteraction) => {
        await ServerRepository.setNoticeChannel(interaction.guild as Guild, interaction.values[0]);
        await interaction.update({ content: '채널 설정이 완료되었습니다.', components: [] });
    }
}

export const solveNoticeChannelButtons: ButtonCommand = {
    command: CommandName.NoticeChannelButton,
    execute: async (interaction: ButtonInteraction) => {
        const guild = interaction.guild as Guild;

        const page: number = parseInt(interaction.customId.split(":")[1]);
        let options = makeDropdown(guild);

        let hasNext: boolean = options.length > (page + 1) * 20;
        const buttons = makeButton(page, hasNext);
        options = options.slice(page * 20, (page + 1) * 20);
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(CommandName.NoticeChannelDropdown)
            .setPlaceholder('채널을 선택해 주세요!')
            .addOptions(options);

        const dropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(selectMenu);
        await interaction.reply({ content: '채널을 선택해 주세요!', components: [dropdown, buttons] });
    }
}

const makeButton = (page: number, hasNext: boolean): ActionRowBuilder<ButtonBuilder> => {
    let previousButton: ButtonBuilder;
    if (page - 1 < 0) {
        previousButton = new ButtonBuilder()
            .setCustomId(CommandName.NoticeChannelButton + ":" + (page - 1) + ":cancel")
            .setLabel(commandText.titleMap[NoticeButtonName.previous])
            .setStyle(ButtonStyle.Secondary)
    } else {
        previousButton = new ButtonBuilder()
            .setCustomId(CommandName.NoticeChannelButton + ":" + (page - 1))
            .setLabel(commandText.titleMap[NoticeButtonName.previous])
            .setStyle(ButtonStyle.Primary);
    }

    let nextButton: ButtonBuilder;
    if (hasNext) {
        nextButton = new ButtonBuilder()
            .setCustomId(CommandName.NoticeChannelButton + ":" + (page + 1))
            .setLabel(commandText.titleMap[NoticeButtonName.next])
            .setStyle(ButtonStyle.Primary);
    } else {
        nextButton = new ButtonBuilder()
            .setCustomId(CommandName.NoticeChannelButton + ":" + (page + 1) + ":cancel")
            .setLabel(commandText.titleMap[NoticeButtonName.next])
            .setStyle(ButtonStyle.Secondary);
    }

    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(previousButton, nextButton)
}

const makeDropdown = (guild: Guild): SelectMenuComponentOptionData[] => {
    const channels = guild.channels.cache.filter(channel => {
        return channel.isTextBased()
    }).map(channel => channel);

    return channels.map(channel => {
        let description = "";
        if (channel.parent) {
            let parentName = channel.parent.name;
            if (parentName.length > 15) {
                parentName = parentName.slice(0, 15) + "...";
            }
            description = "`" + parentName + "` 의 하위 채널";
        }
        // 각 필드 값이 빈 문자열인지 확인하고, 빈 문자열이면 "-"로 대체

        let channelName = channel.name === "" ? "-" : channel.name;
        let channelId = channel.id === "" ? "-" : channel.id;
        let channelparentName = description === "" ? "-" : description;

        if (channelName.length > 25) {
            console.error(`label length is over 25: ${channelName} in server ${guild.name}`);
            channelName = channelName.slice(0, 15) + "...";
        }
        if (channelparentName.length > 25) {
            console.error(`description length is over 25: ${channelparentName} in server ${guild.name}`);
        }

        if (channelId.length > 25) {
            console.error(`value length is over 25: ${channelId} in server ${guild.name}`);
            channelId = channelId.slice(0, 15) + "...";
        }

        return {
            label: channelName,
            value: channelId,
            description: channelparentName,
        };

    }).filter(option => option !== null) as SelectMenuComponentOptionData[];

}