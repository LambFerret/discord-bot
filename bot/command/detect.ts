import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ButtonCommand, RegisterButtonName, Command, CommandName, text } from ".";
import { DetectPlatform, DetectType } from "../model/DetectType";
import ServerRepository from "../repository/ServerRepository";


const ID = CommandName.Detect;
const commandText = text[ID];


export const detect: Command = {
    command: new SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name),

    execute: async (interaction: CommandInteraction) => {
        await interaction.reply({ content: '카테고리를 선택하세요!', components: [initialButtons()] });
    }
}

export const solveDetectButtons: ButtonCommand = {
    command: CommandName.DetectButton,
    execute: async (interaction: ButtonInteraction) => {
        const guildId = interaction.guildId as string;
        const info = await ServerRepository.getDetectInfo(guildId);
        const name = RegisterButtonName[interaction.customId.split(":")[1] as keyof typeof RegisterButtonName];
        switch (name) {
            case RegisterButtonName.broadcast:
                await interaction.update({ content: '방송 감지를 선택하셨습니다!', components: [await broadcastButtons(guildId)] });
                return;
            case RegisterButtonName.new_post:
                await interaction.update({ content: '새글 감지를 선택하셨습니다!', components: [await newPostButtons(guildId)] });
                return;
            case RegisterButtonName.owner_chat:
                return; // TODO : This is not implemented yet
                await interaction.update({ content: '방장 채팅 감지를 선택하셨습니다!', components: [await ownerChatButtons(guildId)] });
                return;
            case RegisterButtonName.else:
                return; // TODO : This is not implemented yet
                await interaction.update({ content: '(후추) 그외를 선택하셨습니다!', components: [await elseButtons(guildId)] });
                return;
            case RegisterButtonName.back:
                await interaction.update({ content: '뒤로가기를 선택하셨습니다!', components: [initialButtons()] });
                return;
            case RegisterButtonName.broadcast_chzzk:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.Broadcast, DetectPlatform.Chzzk, !info.broadcastDetect.chzzk);
                await interaction.update({ components: [await broadcastButtons(guildId)] });
                return;
            case RegisterButtonName.broadcast_afreeca:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.Broadcast, DetectPlatform.Afreeca, !info.broadcastDetect.afreeca);
                await interaction.update({ components: [await broadcastButtons(guildId)] });
                return;
            case RegisterButtonName.broadcast_youtube:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.Broadcast, DetectPlatform.Youtube, !info.broadcastDetect.youtube);
                await interaction.update({ components: [await broadcastButtons(guildId)] });
                return;
            case RegisterButtonName.broadcast_twitch:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.Broadcast, DetectPlatform.Twitch, !info.broadcastDetect.twitch);
                await interaction.update({ components: [await broadcastButtons(guildId)] });
                return;
            case RegisterButtonName.new_post_chzzk:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.NewPost, DetectPlatform.Chzzk, !info.newPostDetect.chzzk);
                await interaction.update({ components: [await newPostButtons(guildId)] });
                return;
            case RegisterButtonName.new_post_afreeca:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.NewPost, DetectPlatform.Afreeca, !info.newPostDetect.afreeca);
                await interaction.update({ components: [await newPostButtons(guildId)] });
                return;
            case RegisterButtonName.new_post_youtube:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.NewPost, DetectPlatform.Youtube, !info.newPostDetect.youtube);
                await interaction.update({ components: [await newPostButtons(guildId)] });
                return;
            case RegisterButtonName.owner_chat_chzzk:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.OwnerChat, DetectPlatform.Chzzk, !info.ownerChatDetect.chzzk);
                await interaction.update({ components: [await ownerChatButtons(guildId)] });
                return;
            case RegisterButtonName.owner_chat_afreeca:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.OwnerChat, DetectPlatform.Afreeca, !info.ownerChatDetect.afreeca);
                await interaction.update({ components: [await ownerChatButtons(guildId)] });
                return;
            case RegisterButtonName.owner_chat_youtube:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.OwnerChat, DetectPlatform.Youtube, !info.ownerChatDetect.youtube);
                await interaction.update({ components: [await ownerChatButtons(guildId)] });
                return;
            case RegisterButtonName.else_naver_cafe:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.Else, DetectPlatform.NaverCafe, !info.elseDetect.naverCafe);
                await interaction.update({ components: [await elseButtons(guildId)] });
                return;
            default:
                break;
        }
    }
}

const initialButtons = (): ActionRowBuilder<ButtonBuilder> => {
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            makeButton(RegisterButtonName.broadcast, true),
            makeButton(RegisterButtonName.new_post, true),
            makeButton(RegisterButtonName.owner_chat, false),
            makeButton(RegisterButtonName.else, false),
        );
}

const broadcastButtons = async (guildId: string): Promise<ActionRowBuilder<ButtonBuilder>> => {
    const info = await ServerRepository.getDetectInfo(guildId);
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            makeButton(RegisterButtonName.broadcast_chzzk, info.broadcastDetect.chzzk),
            makeButton(RegisterButtonName.broadcast_afreeca, info.broadcastDetect.afreeca),
            makeButton(RegisterButtonName.broadcast_youtube, info.broadcastDetect.youtube),
            makeButton(RegisterButtonName.broadcast_twitch, info.broadcastDetect.twitch),
            makeButton(RegisterButtonName.back, true, true),
        );
}

const newPostButtons = async (guildId: string): Promise<ActionRowBuilder<ButtonBuilder>> => {
    const info = await ServerRepository.getDetectInfo(guildId);
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            makeButton(RegisterButtonName.new_post_chzzk, info.newPostDetect.chzzk),
            makeButton(RegisterButtonName.new_post_afreeca, info.newPostDetect.afreeca),
            makeButton(RegisterButtonName.new_post_youtube, info.newPostDetect.youtube),
            makeButton(RegisterButtonName.back, true, true),
        );
}

const ownerChatButtons = async (guildId: string): Promise<ActionRowBuilder<ButtonBuilder>> => {
    const info = await ServerRepository.getDetectInfo(guildId);
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            makeButton(RegisterButtonName.owner_chat_chzzk, info.ownerChatDetect.chzzk),
            makeButton(RegisterButtonName.owner_chat_afreeca, info.ownerChatDetect.afreeca),
            makeButton(RegisterButtonName.owner_chat_youtube, info.ownerChatDetect.youtube),
            makeButton(RegisterButtonName.back, true, true),
        );
}

const elseButtons = async (guildId: string): Promise<ActionRowBuilder<ButtonBuilder>> => {
    const info = await ServerRepository.getDetectInfo(guildId);
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            makeButton(RegisterButtonName.else_naver_cafe, info.elseDetect.naverCafe),
            makeButton(RegisterButtonName.back, true, true),
        );
}

function makeButton(name: RegisterButtonName, setActive: boolean, isBack?: boolean): ButtonBuilder {
    return new ButtonBuilder()
        .setCustomId(CommandName.DetectButton + ":" + name)
        .setLabel(commandText.titleMap[name])
        .setStyle(isBack ? ButtonStyle.Danger : (setActive ? ButtonStyle.Primary : ButtonStyle.Secondary));
}