const Discord = require("discord.js");

var prefixes = ["<@817157253035327548>", "<@!817157253035327548>"]

module.exports = (client, message) => {

  if (message.author.bot) return;
  if(!message.guild) return;

  let prefix = client.config.prefix;

  for (const thisPrefix of prefixes) { 
	      if (message.content.toLowerCase().startsWith(thisPrefix)) prefix = thisPrefix;
  };

  if(!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command)
    || client.commands.find(commandName => commandName.aliases && commandName.aliases.includes(command));

  if (!cmd) return;
  cmd.run(client, message, args);
};