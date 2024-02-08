import { SelectMenuComponentOptionData, SlashCommandBuilder } from "discord.js";

export enum CommandName {
    Ping = "ping",
    Help = "help",
    HelpDropdown = "helpDropdown",
    EntranceChannel = "entrance_channel",
    EntranceChannelDropdown = "entrance_channel_dropdown",
    EntrancePermission = "entrance_permission",
    EntrancePermissionDropdown = "entrance_permission_dropdown",
    NoticeChannel = "notice_channel",
    NoticeChannelDropdown = "entrance_permission_dropdown",
    Postfix = "postfix",
    Detect = "detect",
    DetectButton = "detectButton",
    Initialize = "initialize",
    Register = "register",
    RegisterYoutube = "register_youtube",
    RegisterYoutubeConfirmButton = "register_youtube_confirm_button",
    Afreeca_Setting = "afreeca_setting",
    Afreeca_Setting_Delete = "afreeca_setting_delete"
}
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

const detectButtons: { [key in ButtonName]: string } = {
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
    entrance_channel : {
        id: CommandName.EntranceChannel,
        name: "입장채널등록",
        description: "입장채널을 변경합니다!"
    },
    entrance_channel_dropdown: {
        id: CommandName.EntranceChannelDropdown,
        name: "입장채널dropdown",
        description: "입장채널을 변경합니다! dropdown",
    },
    entrance_permission: {
        id: CommandName.EntrancePermission,
        name: "입장권한",
        description: "입장권한을 변경합니다!"
    },
    entrance_permission_dropdown: {
        id: CommandName.EntrancePermissionDropdown,
        name: "입장권한dropdown",
        description: "입장권한을 변경합니다! dropdown",
    },
    notice_channel: {
        id: CommandName.NoticeChannel,
        name: "알림채널등록",
        description: "알림채널을 변경합니다!"
    },
    notice_channel_dropdown: {
        id: CommandName.NoticeChannelDropdown,
        name: "공지채널dropdown",
        description: "공지채널을 변경합니다! dropdown",
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
        titleMap: detectButtons,
    },
    initialize: {
        id: CommandName.Initialize,
        name: "초기화",
        description: "초기화할때는 서버가 리셋 되지 않도록 주의해주세요",
    },
    register: {
        id: CommandName.Register,
        name: "등록",
        description: "주인님의 정보를 알려주세요!",
        options: [
            {
                label: "플랫폼",
                description: "치지직, 아프리카, 유튜브, 트위치 중 하나를 입력해주세요",
                value: "platform"
            },
            {
                label: "아이디",
                description: "아이디를 입력해주세요. 유튜브는 채널명을 입력해주세요! 검색해볼게요!",
                value: "id"
            }
        ]
    },
    register_youtube: {
        id: CommandName.RegisterYoutube,
        name: "등록_유튜브",
        description: "주인님의 유튜브 채널명을 알려주세요!",
        options: [
            {
                label: "채널명",
                description: "채널명을 입력해주세요 (예시: hanryang1125)",
                value: "channel_name"
            }
        ]
    },
    register_youtube_confirm_button: {
        id: CommandName.RegisterYoutubeConfirmButton,
        name: "등록_유튜브_확인",
        description: "확인",
    },
    afreeca_setting: {
        id: CommandName.Afreeca_Setting,
        name: "아프리카_설정",
        description: "감지하고 싶은 특정 게시판 ID번호 적어주세요! ෆ⸒⸒⸜( ˶'ᵕ'˶)⸝ ",
        options: [
            {
                label: "입력",
                description: "하나의 게시판만 감지하고 싶을 때 입력해주세요!",
                value: "key"
            },
        ]
    },
    afreeca_setting_delete: {
        id: CommandName.Afreeca_Setting_Delete,
        name: "아프리카_설정_초기화",
        description: "모든 게시판에 있는 주인님의 글을 감지합니다!",
    }
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

