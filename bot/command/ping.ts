import { CommandInteraction, Locale, SlashCommandBuilder } from "discord.js";
import { Command, CommandName, text } from ".";
import BotConfig, { MessageColor } from "../BotConfig";

const ID = CommandName.Ping;
const commandText = text[ID];

const ping: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization(Locale.Korean, commandText.name),

    execute: async (interaction: CommandInteraction) => {
        const ping = interaction.client.ws.ping;
        const responseEmbed = await
            BotConfig.makeEmbed(
                "Pong!",
                `지연 시간 : ${ping}ms \n 현재 시각 : ${new Date()}`,
                MessageColor.Default,
                interaction.guildId as string
            );

        await interaction.reply({ embeds: [responseEmbed] });
    }
}

export default ping;