"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Config_1 = require("./config/Config");
const CustomClient_1 = require("./config/CustomClient");
const MessageFormat_1 = require("./MessageFormat");
const AlarmService_1 = tslib_1.__importDefault(require("./service/AlarmService"));
const PostService_1 = tslib_1.__importDefault(require("./service/PostService"));
const ServerService_1 = tslib_1.__importDefault(require("./service/ServerService"));
const SlashCommandService_1 = tslib_1.__importDefault(require("./service/SlashCommandService"));
class DiscordBot {
    slashCommandService;
    alarmService;
    postService;
    client;
    constructor() {
        this.client = new CustomClient_1.CustomClient();
        this.slashCommandService = new SlashCommandService_1.default(this.client);
        this.alarmService = new AlarmService_1.default(this.client);
        this.postService = new PostService_1.default(this.client);
        this.addListeners(this.client);
    }
    addListeners = (client) => {
        client.login(Config_1.CONFIG.DISCORD_BOT_TOKEN);
        client.once(discord_js_1.Events.ClientReady, this.initServers);
        client.on(discord_js_1.Events.GuildCreate, this.createServer);
        client.on(discord_js_1.Events.GuildDelete, (e) => ServerService_1.default.deleteServer(e.id));
        client.on(discord_js_1.Events.MessageReactionAdd, this.handleReactionAdd);
        client.on(discord_js_1.Events.InteractionCreate, this.slashCommandService.handleInteraction);
    };
    createServer = async (guild) => {
        const server = await ServerService_1.default.createServer(guild);
        // DM to guild owner 
        const owner = await guild.fetchOwner();
        (0, MessageFormat_1.introduceBotWithDM)(owner);
        this.readyEachServer(server);
    };
    initServers = async () => {
        const title = `
                                                                   
,--.  ,--.  ,-----.  ,--.   ,--. ,--.   ,--. ,------. ,------. 
|  '--'  | '  .-.  ' |  |   |  | |   \`.'   | |  .---' |  .---' 
|  .--.  | |  | |  | |  |.'.|  | |  |'.'|  | |  \`--,  |  \`--,  
|  |  |  | '  '-'  ' |   ,'.   | |  |   |  | |  \`---. |  \`---. 
\`--'  \`--'  \`-----'  '--'   '--' \`--'   \`--' \`------' \`------' 
                                                               
    `;
        console.log(title);
        await this.checkDBAndBotServerMatch();
        const lists = await ServerService_1.default.getAllServers();
        lists.forEach(server => {
            this.readyEachServer(server);
        });
    };
    test = async () => {
    };
    readyEachServer = async (server) => {
        let serverId = server.id;
        console.log(`==== init ${server.name} server ====`);
        console.log("register slash command");
        this.slashCommandService.registerSlashCommand(serverId);
        // =-=-=-=-=-=- test =-=-=-=-=-=-=
        this.alarmService.makeCron(serverId);
        this.postService.makeCron(serverId);
        // =-=-=-=-=-=- test =-=-=-=-=-=-=
        console.log("=============================");
    };
    checkDBAndBotServerMatch = async () => {
        const botGuilds = this.client.guilds.cache.map(guild => guild.id);
        const dbGuilds = await ServerService_1.default.getAllGuildId();
        dbGuilds.forEach(async (guildId) => {
            if (!botGuilds.includes(guildId)) {
                ServerService_1.default.deleteServer(guildId);
            }
        });
        botGuilds.forEach(async (guildId) => {
            if (!dbGuilds.includes(guildId)) {
                const guild = this.client.guilds.cache.get(guildId);
                ServerService_1.default.createServer(guild);
            }
        });
    };
    handleReactionAdd = async (reaction, user) => {
        if (user.bot)
            return;
        if (reaction.partial)
            await reaction.fetch();
        if (user.partial)
            await user.fetch();
        const entranceInfo = await ServerService_1.default.getEntranceInfo(reaction.message.guildId);
        if (!entranceInfo)
            return;
        const targetMessageId = entranceInfo.messageId;
        const targetEmoji = entranceInfo.emoji;
        if (reaction.message.id === targetMessageId && reaction.emoji.name === targetEmoji) {
            const guild = reaction.message.guild;
            if (!guild)
                return;
            // Get the member from the guild
            const member = await guild.members.fetch(user.id);
            if (!member)
                return;
            // Find the role
            const role = guild.roles.cache.find((role) => role.name === entranceInfo.role);
            if (!role)
                return;
            // Add the role to the member
            await member.roles.add(role);
        }
    };
}
exports.default = DiscordBot;
//# sourceMappingURL=DiscordBot.js.map