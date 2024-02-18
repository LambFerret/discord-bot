"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regiesterYoutubeConfirmButton = exports.registerYoutube = exports.register = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const _1 = require(".");
const BotConfig_1 = tslib_1.__importStar(require("../BotConfig"));
const ExternalAPI_1 = tslib_1.__importDefault(require("../ExternalAPI"));
const DetectType_1 = require("../model/DetectType");
const ServerRepository_1 = tslib_1.__importDefault(require("../repository/ServerRepository"));
const ID = _1.CommandName.Register;
const commandText = _1.text[ID];
const optionsText = commandText.options;
const choices = [
    { name: "치지직", value: DetectType_1.DetectPlatform.Chzzk },
    { name: "아프리카", value: DetectType_1.DetectPlatform.Afreeca },
    { name: "유튜브", value: DetectType_1.DetectPlatform.Youtube },
    { name: "트위치", value: DetectType_1.DetectPlatform.Twitch }
];
exports.register = {
    command: new discord_js_1.SlashCommandBuilder()
        .setName(commandText.id)
        .setDescription(commandText.description)
        .setNameLocalization('ko', commandText.name)
        .addStringOption(option => option.setName(optionsText[0].label)
        .setDescription(optionsText[0].description || '설명이 없습니다.')
        .addChoices(...choices)
        .setRequired(true))
        .addStringOption(option => option.setName(optionsText[1].label)
        .setDescription(optionsText[1].description || '설명이 없습니다.')
        .setMaxLength(100)
        .setRequired(true)),
    execute: async (interaction) => {
        const platform = DetectType_1.DetectPlatform[interaction.options.get(optionsText[0].label)?.value];
        const platformKoreanName = choices.find(choice => choice.value === platform)?.name;
        const id = interaction.options.get(optionsText[1].label)?.value;
        let embedMessage;
        let isError = false;
        switch (platform) {
            case DetectType_1.DetectPlatform.Chzzk:
                const info = await ExternalAPI_1.default.getChzzkLiveInfo(id);
                if (info === undefined)
                    isError = true;
                break;
            case DetectType_1.DetectPlatform.Afreeca:
                const info2 = await ExternalAPI_1.default.getAfreecaLiveInfo(id);
                if (info2 === undefined)
                    isError = true;
                break;
            case DetectType_1.DetectPlatform.Youtube:
                solveYoutube(interaction, id);
                return;
            case DetectType_1.DetectPlatform.Twitch:
                const info4 = await ExternalAPI_1.default.getTwitchLiveInfo(id);
                if (info4 === undefined)
                    isError = true;
                break;
        }
        if (isError) {
            embedMessage = await BotConfig_1.default.makeEmbed(`${platformKoreanName} 에서 아이디 \`${id}\` 를 찾을 수 없어요 (｡•́︿•̀｡) `, `
                **아이디를 다시 확인해주세요!**
                
                *예시*
                - 치지직: \`bb382c2c0cc9fa7c86ab3b037fb5799c\`\n
                - 아프리카: \`maruko86\`\n
                - 유튜브: \`침투부\`\n
                - 트위치: \`zilioner\`\n`, BotConfig_1.MessageColor.Error, interaction.guildId);
        }
        else {
            ServerRepository_1.default.updateDetectID(interaction.guildId, platform, id);
            embedMessage = await BotConfig_1.default.makeEmbed(`${platformKoreanName} 에서 아이디 \`${id}\` 로 등록되었습니다!`, " (ง •̀_•́)ง", BotConfig_1.MessageColor.Confirm, interaction.guildId);
        }
        await interaction.reply({ embeds: [embedMessage] });
    }
};
exports.registerYoutube = {
    command: _1.CommandName.RegisterYoutube,
    execute: async (interaction) => {
        const selectedChannelId = interaction.values[0].split(":")[0];
        console.log(selectedChannelId);
        const channelInfo = await ExternalAPI_1.default.searchYoutubeByChannelID(selectedChannelId);
        if (!channelInfo) {
            // TODO 없어요 ㅠ
            return;
        }
        const embed = await BotConfig_1.default.makeEmbed(`유튜브 채널 \`${channelInfo.channelTitle}\` 가 맞으신가요?`, `*${channelInfo.description}*`, BotConfig_1.MessageColor.Default, interaction.guildId);
        embed
            .setThumbnail(channelInfo.thumbnail);
        // .setURL("https://www.youtube.com/" + channelInfo.url)
        const confirmButton = new discord_js_1.ButtonBuilder()
            .setCustomId(exports.regiesterYoutubeConfirmButton.command + ":" + selectedChannelId + ":" + "confirm")
            .setLabel('맞아')
            .setStyle(discord_js_1.ButtonStyle.Primary);
        const cancelButton = new discord_js_1.ButtonBuilder()
            .setCustomId(exports.regiesterYoutubeConfirmButton.command + ":" + interaction.values[0].split(":")[1] + ":" + "cancel")
            .setLabel('돌아가기')
            .setStyle(discord_js_1.ButtonStyle.Danger);
        const actionRow = new discord_js_1.ActionRowBuilder()
            .addComponents(confirmButton, cancelButton);
        await interaction.update({ embeds: [embed], components: [actionRow] });
    }
};
exports.regiesterYoutubeConfirmButton = {
    command: _1.CommandName.RegisterYoutubeConfirmButton,
    execute: async (interaction) => {
        if (interaction.customId.split(":")[2] === "confirm") {
            const selectedChannelId = interaction.customId.split(":")[1];
            ServerRepository_1.default.updateDetectID(interaction.guildId, DetectType_1.DetectPlatform.Youtube, selectedChannelId);
            const embedMessage = await BotConfig_1.default.makeEmbed(`정상적으로 등록되었습니다!`, " (ง •̀_•́)ง", BotConfig_1.MessageColor.Confirm, interaction.guildId);
            await interaction.update({ embeds: [embedMessage], components: [], content: "" });
        }
        else if (interaction.customId.split(":")[2] === "cancel") {
            const customData = interaction.customId.split(":")[1];
            if (customData)
                await solveYoutube(interaction, customData);
        }
        else {
            // TODO error
            await interaction.update({ content: "에러가 발생했습니다. 다시 시도해주세요!", components: [] });
        }
    }
};
const solveYoutube = async (interaction, channelTitle) => {
    const youtubeInfos = await ExternalAPI_1.default.searchYoutubeChannelIDWithTitle(channelTitle);
    const options = youtubeInfos.map((info) => {
        return {
            label: info.channelTitle,
            description: info.description,
            value: info.id + ":" + info.channelTitle
        };
    });
    const dropdown = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.StringSelectMenuBuilder()
        .setCustomId(exports.registerYoutube.command)
        .setPlaceholder('선택해주세요.')
        .addOptions(options));
    if (interaction.isCommand())
        await interaction.reply({ components: [dropdown] });
    if (interaction.isButton()) {
        await interaction.update({ components: [dropdown], embeds: [] });
    }
};
//# sourceMappingURL=register.js.map