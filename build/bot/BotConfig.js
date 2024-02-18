"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageColor = void 0;
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const ServerRepository_1 = tslib_1.__importDefault(require("./repository/ServerRepository"));
var MessageColor;
(function (MessageColor) {
    MessageColor[MessageColor["Default"] = 16119260] = "Default";
    MessageColor[MessageColor["Confirm"] = 39423] = "Confirm";
    MessageColor[MessageColor["Error"] = 16711680] = "Error";
})(MessageColor = exports.MessageColor || (exports.MessageColor = {}));
class BotConfig {
    static makeEmbed = async (title, description, color, guildId) => {
        const postfix = await ServerRepository_1.default.getServerPostfix(guildId);
        return new builders_1.EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setFooter({
            text: "..." + postfix,
            iconURL: "https://cdn.discordapp.com/app-icons/989700084809756692/4fb523b8fa8021153365a0250e18ee15.png"
        });
    };
}
exports.default = BotConfig;
//# sourceMappingURL=BotConfig.js.map