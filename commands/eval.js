const ownerID = require('../config.json').ownerID;

module.exports = (client, msg, args) => {
  if (msg.author.id === ownerID) {
    let command = '';
    for (let i = 0; i < args.length; i++) {
      command += args[i];
    }
    try {
      msg.channel.send(eval(command));
    } catch (err) {
      return msg.channel.send('There is an issue with your eval request! 🚧');
    }
  } else {
    return msg.channel.send('You are not authorized to use this command!');
  }
}