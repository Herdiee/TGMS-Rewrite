const Discord = require("discord.js");
const fs = require("fs");
const chalk = require('chalk');

const client = new Discord.Client();
const config = require("./config.json");
client.config = config;
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

["command","event"].forEach(handler => {
	require(`./Handlers/${handler}`)(client);
});

client.on('message', async message => {
	if (message.author.id == client.user.id) return;
	try {
		if (message.channel.type === 'news') {
  		await message.crosspost()
    		.then(() => console.log(`Announcement by ${message.author.id} published in ${message.guild.id} `))
		}
	} catch (error) {
  	console.log(chalk.red('Something went wrong crossposting an announcement!'))
	}
});

client.login(config.token);