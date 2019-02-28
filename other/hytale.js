const server = require('../config.json').server;

const axios = require('axios');
let news = [];

function checkNews(client, isOnline, specialkidsonly) {
  axios.get('https://hytale.com/api/blog/post/published')
    .then((res) => {
      if (news !== res.data && news.length !== 0) {
        const year = res.data[0].publishedAt.split('-')[0];
        const month = res.data[0].publishedAt.split('-')[1];
        const link = `https://hytale.com/news/${year}/${month}/${res.data[0].slug}`;
        specialkidsonly.send(`Hytale har fått en ny nyhet! #Hypetale! 🔥\n${link}`);
      }
      if (isOnline) {
        news = res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  setTimeout(() => {
    checkNews(client);
  }, 3600000);
}

module.exports = async (client, isOnline) => {
  if (isOnline) {
    const guild = client.guilds.find(guild => guild.id === server.id);
    const specialkidsonly = guild.channels.find(channel => {
      channel.id === server.mainChannel;
    });
    checkNews(client, isOnline, specialkidsonly);
  }
}