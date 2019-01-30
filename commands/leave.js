const { leave } = require('../helpers/voiceConnection');

module.exports = (client, msg) => {
  leave(client, msg).then(() => {
    msg.channel.send('🤐 Okie dokey, I have left the voice channel!');
  }).catch((err) => {
    msg.channel.send(err);
  });
}