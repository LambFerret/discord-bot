import { ActionRowBuilder, Guild, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { Command, CommandName, DropdownCommand, text } from ".";
import ServerRepository from "../repository/ServerRepository";

const ID = CommandName.EntrancePermission;
const commandText = text[ID];

export const entrancePermission: Command  = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),
    execute: async (interaction: StringSelectMenuInteraction) => {
        const dropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(makePermissionSelectMenu(interaction.guild as Guild));
        await interaction.reply({ content: '기본으로 지급할 역할을 선택해 주세요!', components: [dropdown] });
    }
}

export const entrancePermissionDropdown: DropdownCommand = {
    command: CommandName.EntrancePermissionDropdown,
    execute: async (interaction: StringSelectMenuInteraction) => {
        await ServerRepository.updateGuildEntranceRole(interaction.guildId as string, interaction.values[0]);
        await interaction.update({ content: '설정이 완료되었습니다.', components: []});
    }
}


const makePermissionSelectMenu = (guild: Guild): StringSelectMenuBuilder => {
    const roleNames = guild.roles.cache.map(role => role.name);

    const options = roleNames.map(roleName => {
        return {
            label: roleName,
            value: roleName,
            description: "Role"
        }
    });

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(CommandName.EntrancePermissionDropdown)
        .setPlaceholder('역할을 선택해 주세요!')
        .addOptions(options);

    return selectMenu;

}