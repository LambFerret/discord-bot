import { BaseInteraction, ButtonInteraction, ChatInputCommandInteraction, Client, Collection, Guild, GuildMemberRoleManager, PermissionFlagsBits, PermissionsBitField, REST, Routes, SelectMenuInteraction, StringSelectMenuInteraction } from "discord.js";
import { CONFIG } from "../config/Config";
import { CustomClient } from "./CustomClient";
import { ButtonName, Command, CommandName, DropdownCommand } from "../command";
import { help, helpDropdown } from "../command/help";
import ping from "../command/ping";
import postfix from "../command/postfix";
import { detect, solveDetectButtons } from "../command/detect";
import initialize from "../command/initalize";
import register from "../command/register";

export default class SlashCommandService {

  client: CustomClient;
  hasRole;
  constructor(client: CustomClient) {
    this.client = client;
    this.hasRole = PermissionFlagsBits.BanMembers;
    this.client.commands = new Collection();
  }

  registerSlashCommand = async (guildId: string) => {

    // chat input command
    this.setCommand(help);
    this.setCommand(ping);
    this.setCommand(postfix);
    this.setCommand(detect);
    this.setCommand(initialize);
    this.setCommand(register);

    // dropdown command
    this.setDropdownCommand(helpDropdown);

    // button command
    this.setDropdownCommand(solveDetectButtons);

    const commands = this.client.commands
      .filter((command: any) => typeof command.command !== 'string')
      .map((command: Command) => {
        command.command.setDefaultMemberPermissions(this.hasRole);
        return command.command.toJSON();
      });

    console.log(JSON.stringify(commands));

    const rest = new REST().setToken(CONFIG.DISCORD_BOT_TOKEN);
    await rest.put(
      Routes.applicationGuildCommands(CONFIG.DISCORD_BOT_ID, guildId),
      { body: commands },
    ).then(() => console.log('Successfully registered application commands.'))
      .catch((e) => {

        console.error('Failed to register application commands.');
        console.log(e);
        console.log(commands);

      });
  };

  handleInteraction = async (interaction: BaseInteraction) => {
    if (interaction.isChatInputCommand()) {
      await this.handleChatInputCommand(interaction);
    } else if (interaction.isButton()) {
      await this.handleButtonInteraction(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await this.handleSelectMenuInteraction(interaction);
    }
  }

  handleChatInputCommand = async (interaction: ChatInputCommandInteraction) => {
    const client = interaction.client as CustomClient;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      this.handleError(error, interaction);
    }
  }

  handleButtonInteraction = async (interaction: ButtonInteraction) => {
    const client = interaction.client as CustomClient;
    const command = client.commands.get(CommandName.DetectButton);
    // check the caller has PermissionFlagsBits.BanMembers
    if (interaction.member && 'permissions' in interaction.member) {
      const memberPermissions = interaction.member.permissions as PermissionsBitField;
      if (!memberPermissions.has(this.hasRole)) {
        await interaction.reply({ content: '이 버튼을 사용할 권한이 없습니다.', ephemeral: true });
        return;
      }
    }
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      this.handleError(error, interaction);
    }
  }

  handleSelectMenuInteraction = async (interaction: SelectMenuInteraction) => {
    const client = interaction.client as CustomClient;
    const command = client.commands.get(interaction.customId);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      this.handleError(error, interaction);
    }
  }

  handleError = async (error: unknown, e: BaseInteraction) => {
    const interaction = e as SelectMenuInteraction;
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }

  setCommand = (command: Command) => {
    console.log("set this command : ", command.command.name);
    this.client.commands.set(command.command.name, command);
  }

  setDropdownCommand = (command: DropdownCommand) => {
    console.log("set this dropdown command : ", command.command);
    this.client.commands.set(command.command, command);
  }
}