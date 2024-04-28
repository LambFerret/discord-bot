import { CommandInteraction, Guild, SlashCommandBuilder } from "discord.js";
import { Command, CommandName, text } from ".";
import ServerRepository from "../repository/ServerRepository";

const ID = CommandName.Initialize;
const commandText = text[ID];

const initialize: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),

    execute: async (interaction: CommandInteraction) => {
        await ServerRepository.deleteServerWithDB(interaction.guildId as string);
        await ServerRepository.createNewServer(interaction.guild as Guild);
        await interaction.reply({ content: '초기화' });
    }
}
export default initialize;