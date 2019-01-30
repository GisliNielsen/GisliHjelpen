const ytdl = require('ytdl-core');
const axios = require('axios');
const token = require('../config.json').tokens.youtube;

const queue = [];

exports.getQueue = (client, msg) => {
  return new Promise((resolve, reject) => {
    if (queue[msg.guild.id] !== undefined) {
      return resolve(queue[msg.guild.id]);
    } else {
      return reject('The queue is empty!');
    }
  });
}

exports.addToQueue = (client, msg, args) => {
  return new Promise( async (resolve, reject) => {
    const ytValidate = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    let song;
    if (args[0] !== undefined) {
      if (args[0].match(ytValidate)) {
        song = args[0];
      } else {
        try {
          let query = '';
          for (let i = 0; i < args.length; i++) { 
            if (i + 1 !== args.length) {
              query += `${args[i]} `;
            } else {
              query += `${args[i]} `;
            }
          }
          msg.channel.send(`🔎 Searching YouTube for: ***${query}***`);
          const res = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${query}&key=${token}`);
          if (res.data.items.length) {
            song = `https://www.youtube.com/watch?v=${res.data.items[0].id.videoId}`;
          } else {
            return reject('Found no videos based on your search!');
          }
        } catch (err) {
          return reject(err)
        }
      }
    }
    ytdl.getBasicInfo(song, (err, info) => {
      if (err) { return reject(err); }
      if ( queue[msg.guild.id] === undefined) { queue[msg.guild.id] = []}
      queue[msg.guild.id].push({
        title: info.title,
        thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length - 1].url,
        requestee: msg.author.tag,
        length: info.length_seconds,
        url: song,
      });
      msg.channel.send(`🎺 ***${info.title}*** has been added to the queue by ***${msg.author.tag}***`);
      resolve(queue[msg.guild.id]);
    });  
  });
}

exports.shiftQueue = (client, msg) => {
  return new Promise((resolve, reject) => {
    try {
      queue[msg.guild.id].shift();
      return resolve(queue[msg.guild.id]);
    } 
    catch (err) {
      reject(err);
    }
  });
}