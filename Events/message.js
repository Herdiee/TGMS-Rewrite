// Dependencies
const db = require("quick.db")
const Discord = require("discord.js");

// Use bot mention as a prefix
var prefixes = ["<@817157253035327548>", "<@!817157253035327548>"]

module.exports = (client, message) => {

  // Ignore all bots
  if (message.author.bot) return;

  // Ignore DMS
  if(!message.guild) return;

  // Get prefix from DB and If no prefix is set, use the default prefix from the configuration file.3
  var prefix = db.get(`prefix_${message.guild.id}`);
  if(prefix === null) prefix = client.config.prefix;

  // If bot is mentioned, use it as a prefix (Defined at start of program)
  for (const thisPrefix of prefixes) {
	      if (message.content.toLowerCase().startsWith(thisPrefix)) prefix = thisPrefix;
  };

  // If the message does not start with the bots prefix, ignore it.
  if(!message.content.startsWith(prefix)) return;

  // Command Arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Cooldown, courtesy of documentation/guide.
  const { cooldowns } = client;

  // If the command has a cooldown set
  if (!cooldowns.has(command.name)) {
    // Create a collection with the command name in
    cooldowns.set(command.name, new Discord.Collection());
  }

  // Set the default cooldown to 3 seconds
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  // If the message author is in the timestamps collection
  if (timestamps.has(message.author.id)) {
    // Set the cooldown time to the cooldown amount
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    // If the cooldown time has not expired
    if (now < expirationTime) {
      // Return an error to the user
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command}\` command.`);
    }
  }

  // Set the timeout
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command)
    || client.commands.find(commandName => commandName.aliases && commandName.aliases.includes(command));

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Run the command
  cmd.run(client, message, args);
};