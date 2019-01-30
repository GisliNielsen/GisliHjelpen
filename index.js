const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./config.json').tokens.discord;

const messageController = require('./controllers/messageController');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('disconnect', () => {
  console.log('Disconnected');
})

client.on('reconnecting', () => {
  console.log('reconnecting');
})

client.on('message', msg => {
  messageController(client, msg);
});

client.login(token);