const db = require("quick.db")                                              // Database
const { MessageEmbed } = require("discord.js")                              // Required for embed creation

permsembed = new MessageEmbed()                                             // Embed creation for a permissions error
.setTitle("Error")
.setDescription("Please make sure you have administrator permissions in this guild.")
.setColor("#ff0000")
channeltypeembed = new MessageEmbed()                                       // Embed creation for a channel type error
.setTitle("Error")
.setDescription("Please make sure that the channel provided is a text channel.")
.setColor("#ff0000")
argumentseembed = new MessageEmbed()                                        // Embed creation for a missing arguments error
.setTitle("Error")
.setDescription("No Arguments were provided - Please enter a channel name or ID To set.")
.setColor("#ff0000")
channelalreadyexistsembed = new MessageEmbed()                              // Embed creation if channel already in use
.setTitle("Error")
.setDescription("The channel provided may already be set as a welcome channel")
.setColor("#ff0000")
catchembed = new MessageEmbed()                                             // Embed creation if anything goes wrong
.setTitle("Error")
.setDescription("Missing permissions or the channel provided was not a text channel as an exception occured.")
.setColor("#ff0000")
channelsuccessfullyset = new MessageEmbed()                                 // Embed creation if channel was successfully set
.setTitle("Success!")
.setDescription("The channel was successfully set.")
.setColor("#2ECC71")

module.exports = {
        name: "setlogchammel",
        category: "Configure",
        aliases: [''],
        description: "Sets A Channel Where The Bot Can Send Moderation Logs!",
        usage: "[channel mention | channel ID | channel name]",
    run: async (client, message, args) => {

    if (!message.member.hasPermission("ADMINISTRATOR")) {                   // If the user does not have admin perms
        message.reply(permsembed)                                           // Send a perm error
        return;
    }

    if (!args[0]) {                                                         // If no arguments are provided
      let b = await db.fetch(`logs${message.guild.id}`);                    // Fetch the logging channel
      let channelName = message.guild.channels.cache.get(b);    

      if (message.guild.channels.cache.has(b)) {                            // If the channel exists, display it
        return message.channel.send(
          `**Logging Channel Set In This Guild Is \`${channelName.name}\`!**`
        );

      } else
        return message.channel.send(argumentseembed);                        // Return an error message
    }

        // Get the channel from the arguments provided
        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

        if (!channel || channel.type !== 'text') {                           // Make sure the channel is a text channel
            message.channel.send(channeltypeembed)
            return;
        }

        try {
            let a = await db.fetch(`logs_${message.guild.id}`)              // Fetch the logging channel from the database

            if (channel.id === a) {                                         // If the channel supplied is already the one set
                return message.channel.send(channelalreadyexistsembed)      // Reply with an error

            } else {                                                        // Else, set the logging channel in the database.
                bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send(channelsuccessfullyset)
                db.set(`logs_${message.guild.id}`, channel.id)
                message.channel.send(`**Logging Channel Has Been Set Successfully in \`${channel.name}\`!**`)
            }

        } catch {                                                           // Error Handling
            return message.channel.send(catchembed);
        }
    }
};
