import { EmbedBuilder } from "@discordjs/builders";
import ServerRepository from "./repository/ServerRepository";

export enum MessageColor {
    Default = 0xF5F5DC,
    Confirm = 0x0099ff,
    Error = 0xff0000,
}

export default class BotConfig {
    static makeEmbed = async (title: string, description: string, color: MessageColor, guildId: string): Promise<EmbedBuilder> => {
        const postfix = await ServerRepository.getServerPostfix(guildId);
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setFooter(
                {
                    text: "..." + postfix,
                    iconURL: "https://cdn.discordapp.com/app-icons/989700084809756692/4fb523b8fa8021153365a0250e18ee15.png"
                }
            );
    }
}