import { ActivityType, Client, Collection, GatewayIntentBits, Partials } from "discord.js";

export class CustomClient extends Client {
    public commands: Collection<string, any>;
    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
            partials: [Partials.Message, Partials.Reaction, Partials.User],
            presence: {
                activities: [{ name: '1.1.2v | /설명서 ', type: ActivityType.Listening }],
                status: 'online',
            }
        });
        this.commands = new Collection();
    }
}
