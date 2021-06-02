const db = require("quick.db")
const Discord = require("discord.js");

var prefixes = ["<@817157253035327548>", "<@!817157253035327548>"]

module.exports = (client, message) => {

  if (message.author.bot) return;
  if(!message.guild) return;

  var prefix = db.get(`prefix_${message.guild.id}`);
  if(prefix === null) prefix = client.config.prefix;

  for (const thisPrefix of prefixes) { 
	      if (message.content.toLowerCase().startsWith(thisPrefix)) prefix = thisPrefix;
  };

  if(!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const { cooldowns } = client;
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command}\` command.`);
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  const cmd = client.commands.get(command)
    || client.commands.find(commandName => commandName.aliases && commandName.aliases.includes(command));

  if (!cmd) return;
  cmd.run(client, message, args);
};