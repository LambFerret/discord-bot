import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ButtonCommand, ButtonName, Command, CommandName, text } from ".";
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

        const name = ButtonName[interaction.customId.split(":")[1] as keyof typeof ButtonName];

        switch (name) {
            case ButtonName.broadcast:
                await interaction.update({ content: '방송 감지를 선택하셨습니다!', components: [await broadcastButtons(guildId)] });
                return;
            case ButtonName.new_post:
                await interaction.update({ content: '새글 감지를 선택하셨습니다!', components: [await newPostButtons(guildId)] });
                return;
            case ButtonName.owner_chat:
                await interaction.update({ content: '방장 채팅 감지를 선택하셨습니다!', components: [await ownerChatButtons(guildId)] });
                return;
            case ButtonName.else:
                await interaction.update({ content: '(후추) 그외를 선택하셨습니다!', components: [await elseButtons(guildId)] });
                return;
            case ButtonName.back:
                await interaction.update({ content: '뒤로가기를 선택하셨습니다!', components: [initialButtons()] });
                return;
            case ButtonName.broadcast_chzzk:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.Broadcast, DetectPlatform.Chzzk, !info.broadcastDetect.chzzk);
                await interaction.update({ components: [await broadcastButtons(guildId)] });
                return;
            case ButtonName.broadcast_afreeca:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.Broadcast, DetectPlatform.Afreeca, !info.broadcastDetect.afreeca);
                await interaction.update({ components: [await broadcastButtons(guildId)] });
                return;
            case ButtonName.broadcast_youtube:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.Broadcast, DetectPlatform.Youtube, !info.broadcastDetect.youtube);
                await interaction.update({ components: [await broadcastButtons(guildId)] });
                return;
            case ButtonName.broadcast_twitch:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.Broadcast, DetectPlatform.Twitch, !info.broadcastDetect.twitch);
                await interaction.update({ components: [await broadcastButtons(guildId)] });
                return;
            case ButtonName.new_post_chzzk:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.NewPost, DetectPlatform.Chzzk, !info.newPostDetect.chzzk);
                await interaction.update({ components: [await newPostButtons(guildId)] });
                return;
            case ButtonName.new_post_afreeca:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.NewPost, DetectPlatform.Afreeca, !info.newPostDetect.afreeca);
                await interaction.update({ components: [await newPostButtons(guildId)] });
                return;
            case ButtonName.new_post_youtube:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.NewPost, DetectPlatform.Youtube, !info.newPostDetect.youtube);
                await interaction.update({ components: [await newPostButtons(guildId)] });
                return;
            case ButtonName.owner_chat_chzzk:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.OwnerChat, DetectPlatform.Chzzk, !info.ownerChatDetect.chzzk);
                await interaction.update({ components: [await ownerChatButtons(guildId)] });
                return;
            case ButtonName.owner_chat_afreeca:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.OwnerChat, DetectPlatform.Afreeca, !info.ownerChatDetect.afreeca);
                await interaction.update({ components: [await ownerChatButtons(guildId)] });
                return;
            case ButtonName.owner_chat_youtube:
                await ServerRepository.updateDetectInfo(guildId, interaction.channelId as string, DetectType.OwnerChat, DetectPlatform.Youtube, !info.ownerChatDetect.youtube);
                await interaction.update({ components: [await ownerChatButtons(guildId)] });
                return;
            case ButtonName.else_naver_cafe:
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
            makeButton(ButtonName.broadcast, true),
            makeButton(ButtonName.new_post, true),
            makeButton(ButtonName.owner_chat, true),
            makeButton(ButtonName.else, true),
        );
}

const broadcastButtons = async (guildId: string): Promise<ActionRowBuilder<ButtonBuilder>> => {
    const info = await ServerRepository.getDetectInfo(guildId);
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            makeButton(ButtonName.broadcast_chzzk, info.broadcastDetect.chzzk),
            makeButton(ButtonName.broadcast_afreeca, info.broadcastDetect.afreeca),
            makeButton(ButtonName.broadcast_youtube, info.broadcastDetect.youtube),
            makeButton(ButtonName.broadcast_twitch, info.broadcastDetect.twitch),
            makeButton(ButtonName.back, true, true),
        );
}

const newPostButtons = async (guildId: string): Promise<ActionRowBuilder<ButtonBuilder>> => {
    const info = await ServerRepository.getDetectInfo(guildId);
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            makeButton(ButtonName.new_post_chzzk, info.newPostDetect.chzzk),
            makeButton(ButtonName.new_post_afreeca, info.newPostDetect.afreeca),
            makeButton(ButtonName.new_post_youtube, info.newPostDetect.youtube),
            makeButton(ButtonName.back, true, true),
        );
}

const ownerChatButtons = async (guildId: string): Promise<ActionRowBuilder<ButtonBuilder>> => {
    const info = await ServerRepository.getDetectInfo(guildId);
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            makeButton(ButtonName.owner_chat_chzzk, info.ownerChatDetect.chzzk),
            makeButton(ButtonName.owner_chat_afreeca, info.ownerChatDetect.afreeca),
            makeButton(ButtonName.owner_chat_youtube, info.ownerChatDetect.youtube),
            makeButton(ButtonName.back, true, true),
        );
}

const elseButtons = async (guildId: string): Promise<ActionRowBuilder<ButtonBuilder>> => {
    const info = await ServerRepository.getDetectInfo(guildId);
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            makeButton(ButtonName.else_naver_cafe, info.elseDetect.naverCafe),
            makeButton(ButtonName.back, true, true),
        );
}

function makeButton(name: ButtonName, setActive: boolean, isBack?: boolean): ButtonBuilder {
    return new ButtonBuilder()
        .setCustomId(CommandName.DetectButton + ":" + name)
        .setLabel(commandText.titleMap[name])
        .setStyle(isBack ? ButtonStyle.Danger : (setActive ? ButtonStyle.Primary : ButtonStyle.Secondary));
}