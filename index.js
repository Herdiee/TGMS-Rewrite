// Dependencies
const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const chalk = require('chalk');

// Additional Dependencies
const client = new Discord.Client();
const config = require("./config.json");
client.config = config;
client.commands = new Enmap();
client.cooldowns = new Discord.Collection();

// Command Handler
fs.readdirSync('./Commands').forEach(dirs => {
    const commands = fs.readdirSync(`./Commands/${dirs}`).filter(files => files.endsWith('.js'));
    for (const file of commands) {
        const command = require(`./Commands/${dirs}/${file}`);
        console.log(chalk.green(`Loading command ${file}`));
        let props = require(`./Commands/${dirs}/${file}`);
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
	};
});

// Event Handler
fs.readdir("./Events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
	  const event = require(`./Events/${file}`);
	  console.log(chalk.green(`Loading Event ${file}`));
	  let eventName = file.split(".")[0];
	  client.on(eventName, event.bind(null, client));
	});
});

// Auto-Post Messages in an announcement channel
client.on('message', async message => {
	// Make sure the bot isn't the one sending the message in the channel
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

// Log in using the bot token
client.login(config.token);