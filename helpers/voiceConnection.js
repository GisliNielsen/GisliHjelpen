exports.join = (client, msg) => {
  const vc = msg.member.voiceChannel;
  return new Promise((resolve, reject) => {
    if (vc) {
      vc.join().then((connection) => {
        resolve(connection);
      }).catch((err) => {
        reject(err);
      });
    } else {
      reject('You must be in a voice channel to use voice features');
    }
  });
}

exports.leave = (client, msg) => {
  return new Promise((resolve, reject) => {
    client.voiceConnections.map((vc) => {
      if (msg.guild.id === vc.channel.guild.id) {
        return resolve(vc.disconnect());
      }
    });
    return reject('🚧 I am not in a voice channel!');
  });
}