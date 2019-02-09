const fs = require('fs');

module.exports = (client, message, args) => {
  let Admin = message.guild.roles.find(val => val.name, "Admin");
  if (message.member.roles.has(Admin.id)) {

    let messagecount = parseInt(args.join(' '));
      messagecount = messagecount+1;
      message.channel.fetchMessages({ limit: messagecount }).then((messages) => {
        const messageLog = messages.map((msg) => {
          return {
            userID: msg.author.id,
            username: msg.author.username,
            tag: msg.author.tag,
            message: msg.content,
          };
        });

        const deletee = {
          userID: message.author.id,
          username: message.author.username,
          tag: message.author.tag,
          message: message.content,
        };

        const fileContent = JSON.parse(fs.readFileSync('./purgeLog.json', 'utf8'));

        fileContent.data.push({ deletee, messageLog });

        // const log = `${fileContent}\n\n\n${JSON.stringify(deletee)}\n${JSON.stringify(messageLog)}`;

        fs.writeFile('./purgeLog.json', JSON.stringify(fileContent, null, '\t'), err => {
          if (err) {
            return message.channel.sendMessage('Klarte ikke å logge meldingene!');
          }
          return message.channel.bulkDelete(messages);
        });
      });

  } else {
    return message.channel.send('⛔ Git gud ⛔');
  }
}
