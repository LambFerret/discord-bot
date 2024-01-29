import { Locale, SelectMenuComponentOptionData, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";

export enum CommandName {
    Ping = "ping",
    Help = "help",
    HelpDropdown = "helpDropdown",
    Postfix = "postfix",
    Detect = "detect",
    DetectButton = "detectButton",
    Initialize = "initialize",
}
/* 
 📦 방송
 ├─ 방송감지
 │  ├─ 치지직 chzzk
 │  ├─ 아프리카 afreeca
 │  ├─ 유튜브 youtube
 │  └─ 트위치 twitch
 ├─ 새글 감지
 │  ├─ 치지직
 │  ├─ 아프리카
 │  └─ 유튜브
 ├─ 방장 채팅 감지
 │  ├─ 치지직
 │  ├─ 아프리카
 │  └─ 유튜브
 └─ (후추) 네이버카페 공지 감지
 */
export enum ButtonName {
    broadcast = "broadcast",
    new_post = "new_post",
    owner_chat = "owner_chat",
    else = "else",
    broadcast_chzzk = "broadcast_chzzk",
    broadcast_afreeca = "broadcast_afreeca",
    broadcast_youtube = "broadcast_youtube",
    broadcast_twitch = "broadcast_twitch",
    new_post_chzzk = "new_post_chzzk",
    new_post_afreeca = "new_post_afreeca",
    new_post_youtube = "new_post_youtube",
    owner_chat_chzzk = "owner_chat_chzzk",
    owner_chat_afreeca = "owner_chat_afreeca",
    owner_chat_youtube = "owner_chat_youtube",
    else_naver_cafe = "else_naver_cafe",
    back = "back",
}

const buttonTitles: { [key in ButtonName]: string } = {
    [ButtonName.broadcast]: "방송 감지",
    [ButtonName.new_post]: "새글 감지",
    [ButtonName.owner_chat]: "방장 채팅 감지",
    [ButtonName.else]: "(후추) 그외",
    [ButtonName.broadcast_chzzk]: "치지직 방송 감지",
    [ButtonName.broadcast_afreeca]: "아프리카 방송 감지",
    [ButtonName.broadcast_youtube]: "유튜브 방송 감지",
    [ButtonName.broadcast_twitch]: "트위치 방송 감지",
    [ButtonName.new_post_chzzk]: "치지직 새글 감지",
    [ButtonName.new_post_afreeca]: "아프리카 새글 감지",
    [ButtonName.new_post_youtube]: "유튜브 새글 감지",
    [ButtonName.owner_chat_chzzk]: "치지직 방장 채팅 감지",
    [ButtonName.owner_chat_afreeca]: "아프리카 방장 채팅 감지",
    [ButtonName.owner_chat_youtube]: "유튜브 방장 채팅 감지",
    [ButtonName.else_naver_cafe]: "(후추) 네이버카페 공지 감지",
    [ButtonName.back]: "뒤로가기",
}

export const text: TextType = {
    ping: {
        id: CommandName.Ping,
        name: "핑",
        description: "현재 상태와 지연 시간을 표시합니다."
    },
    help: {
        id: CommandName.Help,
        name: "설명서",
        description: "설명서 입니다!"
    },
    helpDropdown: {
        id: CommandName.HelpDropdown,
        name: "설명서",
        description: "설명서 입니다!!",
        options: [
            {
                label: "노래 명령어",
                description: "노래 관련 명령어 안내...",
                value: "music_commands"
            },
            {
                label: "권한 명령어",
                description: "권한 관련 명령어 안내...",
                value: "permission_commands"
            }
        ]
    },
    postfix: {
        id: CommandName.Postfix,
        name: "말투",
        description: "말투를 변경합니다!",
        options: [
            {
                label: "말투",
                description: "공백으로 말투를 없앨 수 있습니다!",
                value: "postfix"
            }
        ]
    },

    detect: {
        id: CommandName.Detect,
        name: "감지",
        description: "방송을 감지합니다",
        titleMap: buttonTitles,
    },
    initialize: {
        id: CommandName.Initialize,
        name: "초기화",
        description: "초기화할때는 서버가 리셋 되지 않도록 주의해주세요",
    },
}

export type Command = {
    // when has string option
    command: SlashCommandBuilder,
    execute: (interaction: any) => Promise<void>
}

export type DropdownCommand = {
    command: string,
    execute: (interaction: any) => Promise<void>
}

export type ButtonCommand = {
    command: string,
    execute: (interaction: any) => Promise<void>
}

type CommandText = {
    id: CommandName,
    name: string,
    description: string,
    options?: SelectMenuComponentOptionData[],
    titleMap?: any
}

type TextType = {
    [key: string]: CommandText
}

