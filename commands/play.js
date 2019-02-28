const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const { join, leave, status } = require('../helpers/voiceConnection');
const { addToQueue, shiftQueue } = require('../helpers/queue');

let playing = false;

module.exports = async (client, msg, args) => {
  try {
    const connection = await join(client, msg);
    const queue = await addToQueue(client, msg, args);
    if (!playing) {
      setTimeout(() => {
        playSong(client, msg, queue[0], connection);
      }, 100);
    }
  } catch (err) {
    const vcstatus = await status(client, msg);
    if (vcstatus) {
      return await leave();
    }
    return msg.channel.send(err);
  }
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
    if (msg.content.startsWith('!pause')) {
      if (dispatcher.paused) {
        return msg.channel.send('Cannot pause while I am already paused!');
      }
      msg.channel.send('Paused!');
      dispatcher.pause();
    }
    if (msg.content.startsWith('!resume')) {
      if (!dispatcher.paused) {
        return msg.channel.send('Cannot resume while I am already playing!');
      }
      msg.channel.send('Resuming!');
      dispatcher.resume();
    }
  });
  dispatcher.on('end', () => {
    collector.stop();
    playing = false;
    shiftQueue(client, msg)
    .then((queue) => {
      if (queue.length > 0) {
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