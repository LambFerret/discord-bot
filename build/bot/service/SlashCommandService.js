"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const afreecaSetting_1 = require("../command/afreecaSetting");
const detect_1 = require("../command/detect");
const help_1 = require("../command/help");
const initalize_1 = tslib_1.__importDefault(require("../command/initalize"));
const NoticeChannel_1 = require("../command/NoticeChannel");
const ping_1 = tslib_1.__importDefault(require("../command/ping"));
const postfix_1 = tslib_1.__importDefault(require("../command/postfix"));
const register_1 = require("../command/register");
const setting_1 = require("../command/setting");
const Config_1 = require("../config/Config");
class SlashCommandService {
    client;
    hasRole;
    constructor(client) {
        this.client = client;
        this.hasRole = discord_js_1.PermissionFlagsBits.BanMembers;
        this.client.commands = new discord_js_1.Collection();
    }
    registerSlashCommand = async (guildId) => {
        // chat input command
        this.setCommand(help_1.help);
        this.setCommand(ping_1.default);
        this.setCommand(postfix_1.default);
        this.setCommand(detect_1.detect);
        this.setCommand(initalize_1.default);
        this.setCommand(register_1.register);
        this.setCommand(afreecaSetting_1.afreecaSetting);
        // this.setCommand(entranceChannel);
        // this.setCommand(entrancePermission);
        this.setCommand(NoticeChannel_1.noticeChannel);
        this.setCommand(setting_1.setting);
        // dropdown command
        // this.setDropdownCommand(registerYoutube);
        // this.setDropdownCommand(entranceChannelDropdown);
        // this.setDropdownCommand(entrancePermissionDropdown);
        this.setDropdownCommand(NoticeChannel_1.noticeChannelDropdown);
        // button command
        this.setDropdownCommand(detect_1.solveDetectButtons);
        this.setDropdownCommand(setting_1.solveSettingButtons);
        this.setDropdownCommand(NoticeChannel_1.solveNoticeChannelButtons);
        // this.setDropdownCommand(regiesterYoutubeConfirmButton);
        const commandJSON = this.getCommandsJSONFromClient(this.client);
        this.sendCommandsToClient(commandJSON, guildId);
    };
    getCommandsJSONFromClient = (client) => {
        return client.commands
            .filter((command) => typeof command.command !== 'string')
            .map((command) => {
            command.command.setDefaultMemberPermissions(this.hasRole);
            return command.command.toJSON();
        });
    };
    sendCommandsToClient = async (json, guildId) => {
        const rest = new discord_js_1.REST().setToken(Config_1.CONFIG.DISCORD_BOT_TOKEN);
        await rest.put(discord_js_1.Routes.applicationGuildCommands(Config_1.CONFIG.DISCORD_BOT_ID, guildId), { body: json }).then(() => console.log('Successfully registered application commands.'))
            .catch((e) => {
            console.error('Failed to register application commands.');
            console.log(e);
            console.log(json);
        });
    };
    handleInteraction = async (interaction) => {
        if (interaction.isChatInputCommand()) {
            await this.handleChatInputCommand(interaction);
        }
        else if (interaction.isButton()) {
            await this.handleButtonInteraction(interaction);
        }
        else if (interaction.isStringSelectMenu()) {
            await this.handleSelectMenuInteraction(interaction);
        }
    };
    handleChatInputCommand = async (interaction) => {
        const client = interaction.client;
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            await command.execute(interaction);
        }
        catch (error) {
            this.handleError(error, interaction);
        }
    };
    handleButtonInteraction = async (interaction) => {
        const client = interaction.client;
        const commandName = interaction.customId.split(":")[0];
        const command = client.commands.get(commandName);
        if (interaction.member && 'permissions' in interaction.member) {
            const memberPermissions = interaction.member.permissions;
            if (!memberPermissions.has(this.hasRole)) {
                await interaction.reply({ content: '이 버튼을 사용할 권한이 없습니다.', ephemeral: true });
                return;
            }
        }
        if (!command)
            return;
        try {
            await command.execute(interaction);
        }
        catch (error) {
            this.handleError(error, interaction);
        }
    };
    handleSelectMenuInteraction = async (interaction) => {
        const client = interaction.client;
        const command = client.commands.get(interaction.customId);
        if (!command)
            return;
        try {
            await command.execute(interaction);
        }
        catch (error) {
            this.handleError(error, interaction);
        }
    };
    handleError = async (error, e) => {
        const interaction = e;
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
        else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    };
    setCommand = (command) => {
        console.log("set this command : ", command.command.name);
        this.client.commands.set(command.command.name, command);
    };
    setDropdownCommand = (command) => {
        console.log("set this dropdown command : ", command.command);
        this.client.commands.set(command.command, command);
    };
}
exports.default = SlashCommandService;
//# sourceMappingURL=SlashCommandService.js.map