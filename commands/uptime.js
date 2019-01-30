module.exports = (client, msg) => {
	let uptime;
	console.log(client.uptime);
	
  if (client.uptime > 86400000 ) {
    uptime = `${Math.floor( client.uptime / 86400000 )}h`;
  } else if (client.uptime > 3600000) {
    uptime = `${Math.floor( client.uptime / 3600000 )}h`;
  } else if (client.uptime > 60000) { 
    uptime = `${Math.floor( client.uptime / 60000 )}m`; 
  } else { 
    uptime = `${Math.floor( client.uptime / 1000 )}s`;
	}
	
  msg.channel.send(`I have been up for **${uptime}**`);
}