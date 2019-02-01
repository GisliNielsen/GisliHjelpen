const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const { join } = require('../helpers/voiceConnection');
const { addToQueue, shiftQueue } = require('../helpers/queue');

let playing = false;

module.exports = (client, msg, args) => {
  join(client, msg)
  .then((connection) => {
    addToQueue(client, msg, args)
    .then((queue) => {
      if (!playing) {
        setTimeout(() => {
          playSong(client, msg, queue[0], connection);
        }, 100);
      }
    }).catch((err) => {
      msg.channel.send(err);
    });
  }).catch((err) => {
    msg.channel.send(err);
  });
}

function playSong(client, msg, song, connection) {
  playing = true;
  const stream = ytdl(song.url, { filter : 'audioonly' })
  const dispatcher = connection.playStream(stream);
  
  richEmbed(msg, song);

  let collector = msg.channel.createCollector(msg => msg);
  collector.on('collect', msg => {
    if (msg.content.startsWith('!skip')) {
      msg.channel.send('Skipped');
      dispatcher.end();
    }
  });
  dispatcher.on('end', () => {
    collector.stop();
    shiftQueue(client, msg)
    .then((queue) => {
      if (queue.length > 0) {
        playing = false;
        setTimeout(() => {
          playSong(client, msg, queue[0], connection);
        }, 100);
      } else {
        msg.channel.send('No more songs in queue!');
        return connection.disconnect();
      }
    }).catch(() => {
      msg.channel.send('Could not update the playlist!');
      return connection.disconnect();
    });
  });
  dispatcher.on('error', (err) => {
    collector.stop();
    playing = false;
    console.log(err);
    return connection.disconnect();
  })
}

function richEmbed(msg, song) {
  const embed = new Discord.RichEmbed()
    .setColor(3447003)
    .setAuthor(`Playing: ${song.title}`)
    .setDescription('Requested by: ** ' + song.requestee + '**' + '\n' + song.url)
    .setFooter('Song length: ' + song.length)
    .setImage(`${song.thumbnail}`)
    .setTimestamp()
    msg.channel.send({ embed });
}