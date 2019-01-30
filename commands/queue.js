const Discord = require('discord.js')
const { getQueue } = require('../helpers/queue');

module.exports = (client, msg) => {
  getQueue(client, msg)
  .then((queue) => {
    currSong = queue[0];
    const queueArr = queue.slice(1, 10);
    let queueText = '';
    for (let i = 0; i < queueArr.length; i ++) {
      queueText += `[${queueArr[i].title.slice(0, 35)}](${queueArr[i].url}) as requested by ***${queueArr[i].requestee}*** \n`;
    }
    richEmbed(msg, currSong, queueText);
  }).catch((err) => {
    return msg.channel.send(err);
  })
}

function richEmbed(msg, currSong, queue) {
  const embed = new Discord.RichEmbed()
    .setColor(3447003)
    .setAuthor(`Playing: ${currSong.title.slice(0, 35)} as requested by ${currSong.requestee}`)
    .setDescription(queue)
    .setTimestamp()
    msg.channel.send({ embed });
}