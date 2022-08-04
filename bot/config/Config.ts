import * as dotenv from 'dotenv'

dotenv.config()

const {
    MONGO_URI,
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
    TWITCH_API_GATEWAY,
    DISCORD_BOT_TOKEN,
} = process.env as {
    [key: string]: string;
};

export const CONFIG = {
    MONGO_URI: MONGO_URI,
    TWITCH_CLIENT_ID: TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET: TWITCH_CLIENT_SECRET,
    TWITCH_API_GATEWAY: TWITCH_API_GATEWAY,
    DISCORD_BOT_TOKEN: DISCORD_BOT_TOKEN,
    봇추가용URL: "https://discord.com/api/oauth2/authorize?client_id=989700084809756692&permissions=76800&scope=bot",
}