const db = require("quick.db")                                          // Database
const Discord = require("discord.js");                                  // API Wrapper

var prefixes = ["<@817157253035327548>", "<@!817157253035327548>"]      // Use bot mention as a prefix

module.exports = (client, message) => {

  if (message.author.bot) return;                                       // Ignore all bots
  if(!message.guild) return;                                            // Ignore DMS

  var prefix = db.get(`prefix_${message.guild.id}`);                    // Get Prefix from database
  if(prefix === null) prefix = client.config.prefix;                    // If no prefix, use default

  for (const thisPrefix of prefixes) {                                  // If bot mentioned, use it as a prefix
	      if (message.content.toLowerCase().startsWith(thisPrefix)) prefix = thisPrefix;
  };

  if(!message.content.startsWith(prefix)) return;                       // Ignore messages not starting with prefix

  const args = message.content.slice(prefix.length).trim().split(/ +/g);// Command Arguments
  const command = args.shift().toLowerCase();

  const { cooldowns } = client;                                         // Cooldown, courtesy of guide
  if (!cooldowns.has(command.name)) {                                   // If the command has a cooldown set
    cooldowns.set(command.name, new Discord.Collection());              // Create a collection with the command name in
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;                // Set the default cooldown to 3 seconds

  if (timestamps.has(message.author.id)) {                              // If the message author is in the timestamps collection
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;  // Set the cooldown time to the cooldown amount
    if (now < expirationTime) {                                       // If the cooldown time has not expired
      const timeLeft = (expirationTime - now) / 1000;                 // Return an error to the user
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command}\` command.`);
    }
  }

  timestamps.set(message.author.id, now);                              // Set the timeout
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  const cmd = client.commands.get(command)                             // Grab the command data from the client.commands Enmap
    || client.commands.find(commandName => commandName.aliases && commandName.aliases.includes(command));

  if (!cmd) return;                             // Silently exit if command does not exist

  cmd.run(client, message, args);               // Run the command
};