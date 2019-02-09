const prefix = require('../config.json').prefix;

const uptime = require('../commands/uptime');
const join = require('../commands/join');
const leave = require('../commands/leave');
const play = require('../commands/play');
const queue = require('../commands/queue');
const purge = require('../commands/purge');
const eval = require('../commands/eval');

module.exports = (client, msg) => {
	if (msg.content[0] !== prefix) { return; }
	if (msg.author.id === client.user.id) { return; }
	const args = msg.content.split(' ').splice(1);

	if (msg.content === `${prefix}ping`) {
		msg.channel.send('pong!');
	}
	if (msg.content === `${prefix}uptime`) {
  	uptime(client, msg);
	}
	if (msg.content === `${prefix}join`) {
		join(client, msg);
	}
	if (msg.content === `${prefix}leave`) {
		leave(client, msg);
	}
	if (msg.content.startsWith(`${prefix}play`)) {
		play(client, msg, args);
	}
	if (msg.content === `${prefix}queue`) {
		queue(client, msg);
	}
	if (msg.content.startsWith(`${prefix}purge`)) {
		purge(client, msg, args);
	}
	if (msg.content.startsWith(`${prefix}eval`)) {
		eval(client, msg, args);
	}
}