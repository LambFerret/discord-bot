"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solveSettingButtons = exports.setting = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const _1 = require(".");
const ServerRepository_1 = tslib_1.__importDefault(require("../repository/ServerRepository"));
const ID = _1.CommandName.Setting;
const commandText = _1.text[ID];
exports.setting = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),
    execute: async (interaction) => {
        const settingsInfo = await ServerRepository_1.default.getServerSettings(interaction.guildId);
        await interaction.reply({ content: '설정을 선택하세요!', components: [initialButtons(settingsInfo)] });
    }
};
exports.solveSettingButtons = {
    command: _1.CommandName.SettingButton,
    execute: async (interaction) => {
        const guildId = interaction.guildId;
        const info = await ServerRepository_1.default.getServerSettings(guildId);
        const name = _1.SettingButtonName[interaction.customId.split(":")[1]];
        switch (name) {
            case _1.SettingButtonName.new_post_everyone:
                info.newPostIncludeEveryone = !info.newPostIncludeEveryone;
                await ServerRepository_1.default.updateServerSettings(guildId, info);
                await interaction.update({ components: [initialButtons(info)] });
                return;
            case _1.SettingButtonName.live_everyone:
                info.LiveIncludeEveryone = !info.LiveIncludeEveryone;
                await ServerRepository_1.default.updateServerSettings(guildId, info);
                await interaction.update({ components: [initialButtons(info)] });
                return;
        }
    }
};
const initialButtons = (settings) => {
    return new discord_js_1.ActionRowBuilder()
        .addComponents(makeButton(_1.SettingButtonName.new_post_everyone, settings.newPostIncludeEveryone), makeButton(_1.SettingButtonName.live_everyone, settings.LiveIncludeEveryone));
};
function makeButton(name, setActive, isBack) {
    return new discord_js_1.ButtonBuilder()
        .setCustomId(_1.CommandName.SettingButton + ":" + name)
        .setLabel(commandText.titleMap[name])
        .setStyle(isBack ? discord_js_1.ButtonStyle.Danger : (setActive ? discord_js_1.ButtonStyle.Primary : discord_js_1.ButtonStyle.Secondary));
}
//# sourceMappingURL=setting.js.map