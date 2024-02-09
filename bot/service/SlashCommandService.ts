import { BaseInteraction, ButtonInteraction, ChatInputCommandInteraction, Client, Collection, PermissionFlagsBits, PermissionsBitField, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes, SelectMenuInteraction } from "discord.js";
import { Command, DropdownCommand } from "../command";
import { afreecaSetting } from "../command/afreecaSetting";
import { detect, solveDetectButtons } from "../command/detect";
import { entranceChannel, entranceChannelDropdown } from "../command/entranceChannel";
import { entrancePermission, entrancePermissionDropdown } from "../command/entrancePermission";
import { help } from "../command/help";
import initialize from "../command/initalize";
import { noticeChannel, noticeChannelDropdown } from "../command/NoticeChannel";
import ping from "../command/ping";
import postfix from "../command/postfix";
import { regiesterYoutubeConfirmButton, register, registerYoutube } from "../command/register";
import { CONFIG } from "../config/Config";
import { CustomClient } from "../config/CustomClient";

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
    this.setCommand(afreecaSetting);
    this.setCommand(entranceChannel);
    this.setCommand(entrancePermission);
    this.setCommand(noticeChannel);

    // dropdown command
    this.setDropdownCommand(registerYoutube);
    this.setDropdownCommand(entranceChannelDropdown);
    this.setDropdownCommand(entrancePermissionDropdown);
    this.setDropdownCommand(noticeChannelDropdown);

    // button command
    this.setDropdownCommand(solveDetectButtons);
    this.setDropdownCommand(regiesterYoutubeConfirmButton);

    const commandJSON = this.getCommandsJSONFromClient(this.client);
    this.sendCommandsToClient(commandJSON, guildId);

  };

  getCommandsJSONFromClient = (client: CustomClient) => {
    return client.commands
      .filter((command: any) => typeof command.command !== 'string')
      .map((command: Command) => {
        // command.command.setDefaultMemberPermissions(this.hasRole);
        return command.command.toJSON();
      });
  }

  sendCommandsToClient = async (json: RESTPostAPIChatInputApplicationCommandsJSONBody[], guildId: string) => {
    const rest = new REST().setToken(CONFIG.DISCORD_BOT_TOKEN);
    await rest.put(
      Routes.applicationGuildCommands(CONFIG.DISCORD_BOT_ID, guildId),
      { body: json },
    ).then(() => console.log('Successfully registered application commands.'))
      .catch((e) => {

        console.error('Failed to register application commands.');
        console.log(e);
        console.log(json);

      });
  }

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
    const commandName = interaction.customId.split(":")[0];
    const command = client.commands.get(commandName);
    if (interaction.member && 'permissions' in interaction.member) {
      const memberPermissions = interaction.member.permissions as PermissionsBitField;
      // if (!memberPermissions.has(this.hasRole)) {
      //   await interaction.reply({ content: '이 버튼을 사용할 권한이 없습니다.', ephemeral: true });
      //   return;
      // }
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