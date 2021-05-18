// Dependencies
const db = require("quick.db")
const { MessageEmbed } = require("discord.js")

// Embed creation for a permissions error
permsembed = new MessageEmbed()
.setTitle("Error")
.setDescription("Please make sure you have administrator permissions in this guild.")
.setColor("#ff0000")
// Embed creation for a channel type error
channeltypeembed = new MessageEmbed()
.setTitle("Error")
.setDescription("Please make sure that the channel provided is a text channel.")
.setColor("#ff0000")
// Embed creation for a missing arguments error
argumentseembed = new MessageEmbed()
.setTitle("Error")
.setDescription("No Arguments were provided - Please enter a channel name or ID To set.")
.setColor("#ff0000")
// Embed creation if channel already in use
channelalreadyexistsembed = new MessageEmbed()
.setTitle("Error")
.setDescription("The channel provided may already be set as a welcome channel")
.setColor("#ff0000")
// Embed creation if anything goes wrong
catchembed = new MessageEmbed()
.setTitle("Error")
.setDescription("Missing permissions or the channel provided was not a text channel as an exception occured.")
.setColor("#ff0000")

// Embed creation if channel was successfully set
channelsuccessfullyset = new MessageEmbed()
.setTitle("Success!")
.setDescription("The channel was successfully set.")
.setColor("#2ECC71")

module.exports = {
        name: "setlogchammel",
        category: "Configure",
        aliases: [''],
        description: "Sets A Channel Where The Bot Can Send Moderation Logs!",
        usage: "[channel mention | channel ID | channel name]",
    run: async (bot, message, args) => {

    // If the user does not have admin perms, send an error embed.
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(permsembed);

    // If no arguments are provided, send the current logging channel
    if (!args[0]) {
      // Fetch the logging channel from the database
      let b = await db.fetch(`logs${message.guild.id}`);
      let channelName = message.guild.channels.cache.get(b);

      // If the channel from the database exists, name it.
      if (message.guild.channels.cache.has(b)) {
        return message.channel.send(
          `**Logging Channel Set In This Guild Is \`${channelName.name}\`!**`
        );

        // Else error message.
      } else
        return message.channel.send(argumentseembed);
    }

        // Get the channel from the arguments provided
        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

        // Make sure the channel is a text channel
        if (!channel || channel.type !== 'text') return message.channel.send(channeltypeembed);

        try {
            // Fetch the logging channel from the database
            let a = await db.fetch(`logs_${message.guild.id}`)

            // If the channel supplied is already the one set, reply with an error.
            if (channel.id === a) {
                return message.channel.send(channelalreadyexistsembed)

            // Else, set the logging channel in the database.
            } else {
                bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send(channelsuccessfullyset)
                db.set(`logs_${message.guild.id}`, channel.id)
                message.channel.send(`**Logging Channel Has Been Set Successfully in \`${channel.name}\`!**`)
            }

        // Error Handling
        } catch {
            return message.channel.send(catchembed);
        }
    }
};
