import { SlashCommandBuilder, CommandInteraction, BaseInteraction, Locale, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command, text, CommandName } from ".";

const ID = CommandName.Ping;
const commandText = text[ID];

const ping: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization(Locale.Korean, commandText.name),

    execute: async (interaction: CommandInteraction) => {
        const ping = interaction.client.ws.ping;
        const responseEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Pong!')
            .setDescription(`
        pong!  ${ping}ms \n
        현재 시각 : ${new Date()} 
      `);
        await interaction.reply({ embeds: [responseEmbed] });
    }
}

export default ping;