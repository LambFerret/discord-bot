import { SelectMenuComponentOptionData, SlashCommandBuilder } from "discord.js";

export enum CommandName {
    Ping = "ping",
    Help = "help",
    EntranceChannel = "entrance_channel",
    EntranceChannelDropdown = "entrance_channel_dropdown",
    EntrancePermission = "entrance_permission",
    EntrancePermissionDropdown = "entrance_permission_dropdown",
    NoticeChannel = "notice_channel",
    NoticeChannelDropdown = "notice_channel_dropdown",
    Postfix = "postfix",
    Detect = "detect",
    DetectButton = "detectButton",
    Initialize = "initialize",
    Register = "register",
    RegisterYoutube = "register_youtube",
    RegisterYoutubeConfirmButton = "register_youtube_confirm_button",
    Afreeca_Setting = "afreeca_setting",
    Setting = "setting",
    SettingButton = "settingButton",
    NoticeChannelButton = "noticeChannelButton",
}
export enum RegisterButtonName {
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

const detectButtons: { [key in RegisterButtonName]: string } = {
    [RegisterButtonName.broadcast]: "방송 감지",
    [RegisterButtonName.new_post]: "새글 감지",
    [RegisterButtonName.owner_chat]: "(공사중) 방장 채팅 감지",
    [RegisterButtonName.else]: "(공사중) 그외",
    [RegisterButtonName.broadcast_chzzk]: "치지직 방송 감지",
    [RegisterButtonName.broadcast_afreeca]: "아프리카 방송 감지",
    [RegisterButtonName.broadcast_youtube]: "유튜브 방송 감지",
    [RegisterButtonName.broadcast_twitch]: "트위치 방송 감지",
    [RegisterButtonName.new_post_chzzk]: "치지직 새글 감지",
    [RegisterButtonName.new_post_afreeca]: "아프리카 새글 감지",
    [RegisterButtonName.new_post_youtube]: "유튜브 새글 감지",
    [RegisterButtonName.owner_chat_chzzk]: "치지직 방장 채팅 감지",
    [RegisterButtonName.owner_chat_afreeca]: "아프리카 방장 채팅 감지",
    [RegisterButtonName.owner_chat_youtube]: "유튜브 방장 채팅 감지",
    [RegisterButtonName.else_naver_cafe]: "(후추) 네이버카페 공지 감지",
    [RegisterButtonName.back]: "뒤로가기",
}

export enum SettingButtonName {
    new_post_everyone = "new_post_everyone",
    live_everyone = "live_everyone",
    erase_previous_message = "erase_previous_message",
}

const settingButtons: { [key in SettingButtonName]: string } = {
    [SettingButtonName.new_post_everyone]: "새글 감지에 @everyone 추가",
    [SettingButtonName.live_everyone]: "방송 감지에 @everyone 추가",
    [SettingButtonName.erase_previous_message]: "이전 메시지 삭제하기",
}

export enum NoticeButtonName {
    previous = "previous",
    next = "next",
}

const noticeButtons: { [key in NoticeButtonName]: string } = {
    [NoticeButtonName.previous]: "이전",
    [NoticeButtonName.next]: "다음",
}

export const text: TextType = {
    ping: {
        id: CommandName.Ping,
        name: "핑",
        description: "현재 상태와 지연 시간을 표시합니다!  ෆ⸒⸒⸜( ˶'ᵕ'˶)⸝ "
    },
    help: {
        id: CommandName.Help,
        name: "설명서",
        description: "DM으로 설명서를 보내드릴게요!  ෆ⸒⸒⸜( ˶'ᵕ'˶)⸝ "
    },
    entrance_channel: {
        id: CommandName.EntranceChannel,
        name: "입장채널등록",
        description: "입장채널을 변경합니다!  ෆ⸒⸒⸜( ˶'ᵕ'˶)⸝ "
    },
    entrance_channel_dropdown: {
        id: CommandName.EntranceChannelDropdown,
        name: "입장채널dropdown",
        description: "입장채널을 변경합니다! dropdown",
    },
    entrance_permission: {
        id: CommandName.EntrancePermission,
        name: "입장권한",
        description: "입장권한을 변경합니다!  ෆ⸒⸒⸜( ˶'ᵕ'˶)⸝ "
    },
    entrance_permission_dropdown: {
        id: CommandName.EntrancePermissionDropdown,
        name: "입장권한dropdown",
        description: "입장권한을 변경합니다! dropdown",
    },
    notice_channel: {
        id: CommandName.NoticeChannel,
        name: "알림채널등록",
        description: "알림채널을 변경합니다!  ෆ⸒⸒⸜( ˶'ᵕ'˶)⸝ ",
        titleMap: noticeButtons,
    },
    notice_channel_dropdown: {
        id: CommandName.NoticeChannelDropdown,
        name: "공지채널dropdown",
        description: "공지채널을 변경합니다! dropdown",
    },
    postfix: {
        id: CommandName.Postfix,
        name: "말투",
        description: "말투를 변경합니다!  ෆ⸒⸒⸜( ˶'ᵕ'˶)⸝ ",
        options: [
            {
                label: "말투",
                description: "'없음'을 입력하여 없앨 수 있습니다!",
                value: "postfix"
            }
        ]
    },

    detect: {
        id: CommandName.Detect,
        name: "감지",
        description: "방송을 감지합니다!  ෆ⸒⸒⸜( ˶'ᵕ'˶)⸝ ",
        titleMap: detectButtons,
    },
    initialize: {
        id: CommandName.Initialize,
        name: "초기화",
        description: "제가가진 서버 정보를 초기화합니다! 주의해주세요!",
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
        description: "주인님의 유튜브 채널명을 알려주세요!  ෆ⸒⸒⸜( ˶'ᵕ'˶)⸝ ",
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
    setting: {
        id: CommandName.Setting,
        name: "설정",
        description: "하우미의 설정을 변경합니다!  ෆ⸒⸒⸜( ˶'ᵕ'˶)⸝ ",
        titleMap: settingButtons,
    },
}


export type Command = {
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

