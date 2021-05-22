const db = require("quick.db")                                          // Database for storing config stuff
const { MessageEmbed } = require('discord.js');                         // Required for Embeds
const chalk = require('chalk');                                         // Colored Logs

permsembed = new MessageEmbed()                                         // Embed creation for a permissions error
.setTitle("Error")
.setDescription("Please make sure you have administrator permissions in this guild.")
.setColor("#ff0000")
channeltypeembed = new MessageEmbed()                                   // Embed creation for a channel type error
.setTitle("Error")
.setDescription("Please make sure that the channel provided is a text channel.")
.setColor("#ff0000")
argumentseembed = new MessageEmbed()                                    // Embed creation for a missing arguments error
.setTitle("Error")
.setDescription("No Arguments were provided - Please enter a channel name or ID To set.")
.setColor("#ff0000")
channelalreadyexistsembed = new MessageEmbed()                          // Embed creation if channel already in use
.setTitle("Error")
.setDescription("The channel provided may already be set as a welcome channel")
.setColor("#ff0000")
catchembed = new MessageEmbed()                                         // Embed creation if anything goes wrong
.setTitle("Error")
.setDescription("Missing permissions or the channel provided was not a text channel as an exception occured.")
.setColor("#ff0000")
channelsuccessfullyset = new MessageEmbed()                             // Embed creation if channel was successfully set
.setTitle("Success!")
.setDescription("The channel was successfully set.")
.setColor("#2ECC71")

module.exports = {
        name: "setWelcomeChannel",
        category: "Configuration",
        aliases: ['setw', 'sw', 'swc'],
        description: "Sets A Channel Where The bot will send a welcome message!",
        usage: "[channel mention | channel ID | channel name]",
    run: async (client, message, args) => {

    if (!message.member.hasPermission("ADMINISTRATOR")) {               // If the user does not have admin perms
        message.reply(permsembed)                                       // Reply with an erorr
        return;
    }
    
    if (!args[0]) {                                                     // No Arguments, send what the welcome channel is set to
      let b = await db.fetch(`joinchannel_${message.guild.id}`);        // Fetch join channel from database
      let channelName = message.guild.channels.cache.get(b);

      if (message.guild.channels.cache.has(b)) {                        // If the channel exists, name it
        return message.channel.send(
          `**New Member Join Channel Set In This Server Is \`${channelName.name}\`!**`
        );

      } else                                                            // If no arguments, send an error message
        return message.channel.send(argumentseembed);
    }

        // Get the channel from the arguments provided
        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

        if (!channel || channel.type !== 'text') {                      // Make sure the channel is a text channel
            message.reply(channeltypeembed)
            return;
        }

        try {
            let a = await db.fetch(`joinchannel_${message.guild.id}`)   // Get the join channel from the database

            if (channel.id === a) {                                     // If the channel is already set, send an error.
                message.channel.send(channelalreadyexistsembed)
            }

            // Set the welcome channel in the database
            client.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send(channelsuccessfullyset)
            db.set(`joinchannel_${message.guild.id}`, channel.id)
            message.channel.send(`**Welcome Channel Has Been Set Successfully in \`${channel.name}\`!**`)

        } catch {
            return message.reply(catchembed);                                   // Exception Handling
        }
    }
};
