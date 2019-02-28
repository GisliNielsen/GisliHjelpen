const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./config.json').tokens.discord;

const messageController = require('./controllers/messageController');
const hytale = require('./other/hytale');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  hytale(client, true);
});

client.on('disconnect', () => {
  console.log('Disconnected');
  hytale(client, false);
})

client.on('reconnecting', () => {
  console.log('reconnecting');
})

client.on('message', msg => {
  messageController(client, msg);
});

if (client) {
  hytale(client);
}


client.login(token);