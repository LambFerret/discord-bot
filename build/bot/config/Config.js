"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const tslib_1 = require("tslib");
const dotenv = tslib_1.__importStar(require("dotenv"));
dotenv.config();
const { MONGO_URI, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_API_GATEWAY, YOUTUBE_API_KEY, DISCORD_BOT_TOKEN, DISCORD_BOT_ID, TWITCH_STREAMER_ID, AFREECA_STREAMER_ID, } = process.env;
exports.CONFIG = {
    MONGO_URI: MONGO_URI,
    TWITCH_CLIENT_ID: TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET: TWITCH_CLIENT_SECRET,
    TWITCH_API_GATEWAY: TWITCH_API_GATEWAY,
    YOUTUBE_API_KEY: YOUTUBE_API_KEY,
    DISCORD_BOT_TOKEN: DISCORD_BOT_TOKEN,
    DISCORD_BOT_ID: DISCORD_BOT_ID,
    TWITCH_STREAMER_ID: TWITCH_STREAMER_ID,
    AFREECA_STREAMER_ID: AFREECA_STREAMER_ID,
    봇추가용URL: "***",
};
//# sourceMappingURL=Config.js.map