import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ButtonCommand, Command, CommandName, text, SettingButtonName } from ".";
import { Settings } from "../model/ServerType";
import ServerRepository from "../repository/ServerRepository";

const ID = CommandName.Setting;
const commandText = text[ID];

export const setting: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),

    execute: async (interaction: CommandInteraction) => {
        const settingsInfo: Settings = await ServerRepository.getServerSettings(interaction.guildId as string);
        await interaction.reply({ content: '설정을 선택하세요!', components: [initialButtons(settingsInfo)] });
    }
}

export const solveSettingButtons: ButtonCommand = {
    command: CommandName.SettingButton,
    execute: async (interaction: ButtonInteraction) => {
        const guildId = interaction.guildId as string;
        const info: Settings = await ServerRepository.getServerSettings(guildId);
        const name = SettingButtonName[interaction.customId.split(":")[1] as keyof typeof SettingButtonName];

        switch (name) {
            case SettingButtonName.new_post_everyone:
                info.newPostIncludeEveryone = !info.newPostIncludeEveryone;
                await ServerRepository.updateServerSettings(guildId, info);
                await interaction.update({ components: [initialButtons(info)] });
                return;
            case SettingButtonName.live_everyone:
                info.liveIncludeEveryone = !info.liveIncludeEveryone;
                await ServerRepository.updateServerSettings(guildId, info);
                await interaction.update({ components: [initialButtons(info)] });
                return;
            case SettingButtonName.erase_previous_message:
                info.erasePreviousMessage = !info.erasePreviousMessage;
                await ServerRepository.updateServerSettings(guildId, info);
                await interaction.update({ components: [initialButtons(info)] });
                return;
        }
    }
}

const initialButtons = (settings: Settings): ActionRowBuilder<ButtonBuilder> => {
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            makeButton(SettingButtonName.new_post_everyone, settings.newPostIncludeEveryone),
            makeButton(SettingButtonName.live_everyone, settings.liveIncludeEveryone),
            makeButton(SettingButtonName.erase_previous_message, settings.erasePreviousMessage)
        );
}

function makeButton(name: SettingButtonName, setActive: boolean, isBack?: boolean): ButtonBuilder {
    return new ButtonBuilder()
        .setCustomId(CommandName.SettingButton + ":" + name)
        .setLabel(commandText.titleMap[name])
        .setStyle(isBack ? ButtonStyle.Danger : (setActive ? ButtonStyle.Primary : ButtonStyle.Secondary));
}