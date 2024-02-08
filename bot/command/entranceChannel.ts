import { SlashCommandBuilder, StringSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, SelectMenuComponentOptionData, CommandInteraction, Guild } from "discord.js";
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
        await interaction.reply({ content: 'Please select an option:', components: [dropdown] });
    }
}

export const entranceChannelDropdown: DropdownCommand = {
    command: CommandName.EntranceChannelDropdown,
    execute: async (interaction: StringSelectMenuInteraction) => {
        const entranceInfo = await ServerRepository.getEntranceInfo(interaction.guildId as string);
        if (entranceInfo.messageId !== "") {
            const entranceChannel = interaction.guild?.channels.cache.get(entranceInfo.entranceChannelId);
            if (entranceChannel && entranceChannel.isTextBased()) {
                const message = await entranceChannel.messages.fetch(entranceInfo.messageId);
                if (message) {
                    message.delete();
                }
            }
        }

        await ServerRepository.setEntranceChannel(interaction.guild as Guild, interaction.values[0]);
        await interaction.update({ content: '설정이 완료되었습니다.' });

        if (entranceInfo) {
            const entranceChannel = interaction.guild?.channels.cache.get(entranceInfo.entranceChannelId);
            if (entranceChannel && entranceChannel.isTextBased()) {
                const message = await entranceChannel.send(`${entranceInfo.quote}`);
                if (message) {
                    ServerRepository.saveEntranceMessageId(interaction.guildId as string, message.id);
                    message.react(entranceInfo.emoji);
                } else {
                    await interaction.update({ content: "갱신 실패! " });
                }
            }
        }
    }
}

const makeChannelSelectMenu = (guild: Guild): StringSelectMenuBuilder => {
    const channels = guild.channels.cache.filter(channel => channel.isTextBased()).map(channel => channel);

    const options = channels.map(channel => {
        return {
            label: channel.name,
            value: channel.id,
            description: typeof channel
        }
    });

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(CommandName.EntranceChannelDropdown)
        .setPlaceholder('Nothing selected')
        .addOptions(options);

    return selectMenu;

}