"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomClient = void 0;
const discord_js_1 = require("discord.js");
class CustomClient extends discord_js_1.Client {
    commands;
    constructor() {
        super({
            intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent, discord_js_1.GatewayIntentBits.GuildMessageReactions],
            partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Reaction, discord_js_1.Partials.User],
            presence: {
                activities: [{ name: '1.0.2v | /설명서 ', type: discord_js_1.ActivityType.Listening }],
                status: 'online',
            }
        });
        this.commands = new discord_js_1.Collection();
    }
}
exports.CustomClient = CustomClient;
//# sourceMappingURL=CustomClient.js.map