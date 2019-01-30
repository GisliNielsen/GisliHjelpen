const { join } = require('../helpers/voiceConnection');

module.exports = (client, msg) => {
  join(client, msg).then(() => {
    msg.channel.send('📣 I have joined your voice channel')
  })
}