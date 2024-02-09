import { ActionRowBuilder, Guild, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { Command, CommandName, DropdownCommand, text } from ".";
import ServerRepository from "../repository/ServerRepository";

const ID = CommandName.EntranceChannel;
const commandText = text[ID];

export const entranceChannel: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),
    execute: async (interaction: StringSelectMenuInteraction) => {
        const dropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(makeChannelSelectMenu(interaction.guild as Guild));
        await interaction.reply({ content: '채널을 선택해 주세요!', components: [dropdown] });
    }
}

export const entranceChannelDropdown: DropdownCommand = {
    command: CommandName.EntranceChannelDropdown,
    execute: async (interaction: StringSelectMenuInteraction) => {
        const entranceInfo = await ServerRepository.getEntranceInfo(interaction.guildId as string);
        if (entranceInfo.messageId !== "") {
            const entranceChannel = interaction.guild?.channels.cache.get(entranceInfo.entranceChannelId);
            if (entranceChannel && entranceChannel.isTextBased()) {
                try {
                    const message = await entranceChannel.messages.fetch(entranceInfo.messageId);
                    if (message) {
                        message.delete();
                    }
                } catch (error) {
                    console.error("message already deleted error");
                }
            }
        }

        await ServerRepository.setEntranceChannel(interaction.guild as Guild, interaction.values[0]);
        entranceInfo.entranceChannelId = interaction.values[0];
        await interaction.update({ content: '설정이 완료되었습니다.', components: [] });

        const entranceChannel = interaction.guild?.channels.cache.get(entranceInfo.entranceChannelId);
        if (entranceChannel && entranceChannel.isTextBased()) {
            const message = await entranceChannel.send(`${entranceInfo.quote}`);
            if (message) {
                ServerRepository.saveEntranceMessageId(interaction.guildId as string, message.id);
                message.react(entranceInfo.emoji);
            } else {
                await interaction.update({ content: "예상치 못한 오류가 발생했어요 ", components: [] });
            }
        }

    }
}

const makeChannelSelectMenu = (guild: Guild): StringSelectMenuBuilder => {
    const channels = guild.channels.cache.filter(channel => {
        return channel.isTextBased()
    }).map(channel => channel);

    const options = channels.map(channel => {
        let description = "";
        if (channel.parent) description = "\`" + channel.parent.name + "\` 의 하위 채널";
        return {
            label: channel.name,
            value: channel.id,
            description: description,
        }
    });

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(CommandName.EntranceChannelDropdown)
        .setPlaceholder('채널을 선택해 주세요!')
        .addOptions(options);

    return selectMenu;

}