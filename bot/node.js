
const Discord = require('discord.js');
const { Client, Intents, MessageEmbed } = require('discord.js');
const config = require("../config.json")
var fs = require('fs');
var util = require('util');
const axios = require('axios');
const cheerio = require('cheerio');
let isStarted = false;
const cslog = function (d) { //
  let c;
  if (typeof d === 'object') {
    c = util.inspect(d)
  } else {
    c = d
  }
  fs.appendFileSync('debug.log', '\n' + c + '\n');
};

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', listener => {

})


client.on('messageCreate', (msg) => {
  if (msg.content.includes("자하라")) {
    msg.channel.send({ embeds: [embededMsg()] })
  }
  if (!isStarted && msg.content.includes("스타또")) {
    isStarted = !isStarted
    reminder(msg)
    setInterval(() => reminder(msg), 3600000);
  }

});

client.on('channelPinsUpdate', pin => {
  pin.messages.fetch({ limit: 5 }).then(msg => {
    cslog(msg);
  })
})

function reminder(msg) {
  const d = new Date()
  if (d.getHours()%3 == 0 && d.getHours()>11) {
    msg.channel.send('새로운 피드 있나 확인하기! : ' + config.instagram)
  }
}

const embededMsg = () => new MessageEmbed()
  .setColor('#0000ff')
  .setTitle('댱이 인스타그램')
  .setURL(config.instagram)
  .setDescription('인스타그램 링크')
  .setThumbnail(config.thumbnailURL)
  .addFields(
    { name: '트위터', value: config.twitter, inline: true },
    { name: '트위치(오픈예정)', value: config.twitch, inline: true },
    { name: '유튜브(오픈예정)', value: config.youtube, inline: true },
  )
  .setImage('https://pbs.twimg.com/media/FUuURq_aAAAoZ9G?format=jpg&name=small')

const twitterCrawling = async () => {
  const getHtml = async () => {
    try {
      return await axios.get(config.twitter);
    } catch (error) {
      console.error(error);
    }
  };
  getHtml().then(html => {
    let ulList = [];
    console.log(html.data);
    const $ = cheerio.load(html.data);
    const $bodyList = $("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-jxzhtn.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div:nth-child(2) > div > div > section > div > div")


    $bodyList.each((i, elem) => {
      console.log(elem);
      ulList.push(elem)
    })
    console.log(ulList);
  })
}


client.login(config.TOKEN);