import { BaseInteraction, Message, MessageReaction, PartialMessageReaction, PartialUser, REST, Role, Routes, SlashCommandBuilder, User } from "discord.js";
import { CONFIG } from "../config/Config";

export default class SlashCommandService {
    
  slashCommands: Map<string, (interaction: any) => Promise<void>>;

  constructor() {
    this.slashCommands = new Map();
  }

  registerSlashCommand = async (guildId: string) => {
    const commands = [];
    const ping = new SlashCommandBuilder()
      .setName('ping').setDescription('Replies with pong!')
      .addIntegerOption(option => option.setName('integer').setDescription('A random integer')) 
      .addBooleanOption(option => option.setName('boolean').setDescription('A random boolean'))
      .setDMPermission(true)
      .setNameLocalization("ko", "핑")
    commands.push(ping);

    const executePing = async (interaction: Message) => {
      await interaction.reply("pong!");
    }

    this.slashCommands.set('ping', executePing);

    const rest = new REST().setToken(CONFIG.DISCORD_BOT_TOKEN);
    rest.put(
      Routes.applicationGuildCommands(CONFIG.DISCORD_BOT_ID, guildId),
      { body: commands },
    ).then(() => console.log('Successfully registered application commands.')
    )
  }

  handleInteraction = async (interaction: BaseInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;
    const executeFunction = this.slashCommands.get(commandName);
    if (!executeFunction) return;
    executeFunction(interaction);
  }

  handleReactionAdd = async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();
  }
}