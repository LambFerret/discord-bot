import * as dotenv from 'dotenv'

dotenv.config()

const {
    MONGO_URI
} = process.env;

export const CONFIG = {
    mongo: MONGO_URI,
    TOKEN: "OTg5NzAwMDg0ODA5NzU2Njky.GqxceH.l8WuqtQQBUtUNxn6UEH2iYh-mJtssaUyT8ZkwQ",
    URL: "https://discord.com/api/oauth2/authorize?client_id=989700084809756692&permissions=76800&scope=bot",
    instagram: "https://www.instagram.com/dyang.yi_melody/",
    twitter: "https://mobile.twitter.com/dyangyi",
    twitch: "https://www.twitch.tv/dyangyi",
    youtube: "https://www.youtube.com/channel/UCDZzqeIgqBXdozX08CpTGlA",
    thumbnailURL: "https://static-cdn.jtvnw.net/jtv_user_pictures/511b0639-9b36-4a3f-b83a-703b845c6f11-profile_image-70x70.png",
    twitchClientID: "4f0dkwr6ykwtyb5kqulxsse2wn1cqr",
    twitchEndpoint: "http://localhost",
    mongoUrl: "mongodb+srv://lamb:S9ttLUkMy5Af76Ys@cluster0.nozuy.mongodb.net/?retryWrites=true&w=majority"

}