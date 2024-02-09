import { CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { Command, CommandName, text } from ".";
import { introduceBotWithDM } from "../MessageFormat";
const ID = CommandName.Help;
const commandText = text[ID];

export const help: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),
    execute: async (interaction: CommandInteraction) => {
        if (interaction.member && interaction.member instanceof GuildMember) {
            introduceBotWithDM(interaction.member);
        }
        interaction.reply({ content: "DM으로 도움말을 보내드렸어요!", ephemeral: true });
    }
}