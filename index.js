const Discord = require("discord.js");						// API Wrapper
const fs = require("fs");									// JS File System
const chalk = require('chalk');								// Colored Logs

const client = new Discord.Client();
const config = require("./config.json");
client.config = config;
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

["command","event"].forEach(handler => {					// Command and Event Handler
	require(`./Handlers/${handler}`)(client);
});

client.on('message', async message => {							// Auto-Post Messages in an announcement channel
	if (message.author.id == client.user.id) return;			// Make sure the bot isn't the author
	try {
		if (message.channel.type === 'news') {
  		await message.crosspost()
    		.then(() => console.log(`Announcement by ${message.author.id} published in ${message.guild.id} `))
		}
	} catch (error) {
  	console.log(chalk.red('Something went wrong crossposting an announcement!'))
	}
});

client.login(config.token);										// Log in using the bot token