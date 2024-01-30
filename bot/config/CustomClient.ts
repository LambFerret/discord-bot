import { ActivityType, Client, Collection, GatewayIntentBits, Partials } from "discord.js";

export class CustomClient extends Client {
    public commands: Collection<string, any>;
    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions],
            partials: [Partials.Message, Partials.Reaction, Partials.User],
            presence: {
                activities: [{ name: '쟌코봇설명서 ', type: ActivityType.Listening }],
                status: 'online'
            }
        });
        this.commands = new Collection();
    }
}
