// Dependencies
const db = require("quick.db")
const { MessageEmbed } = require('discord.js');
const chalk = require('chalk');

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
        name: "setWelcomeChannel",
        category: "Configuration",
        aliases: ['setw', 'sw', 'swc'],
        description: "Sets A Channel Where The bot will send a welcome message!",
        usage: "[channel mention | channel ID | channel name]",
    run: async (bot, message, args) => {

    // If the user does not have admin perms, send an error embed.
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(permsembed);
    
    // If no arguments are provided, send the current welcome channel
    if (!args[0]) {
      // Fetch the join channel from the database
      let b = await db.fetch(`joinchannel_${message.guild.id}`);
      let channelName = message.guild.channels.cache.get(b);

      // If the channel from the database exists, name it.
      if (message.guild.channels.cache.has(b)) {
        return message.channel.send(
          `**New Member Join Channel Set In This Server Is \`${channelName.name}\`!**`
        );

      // Else erorr message.
      } else
        return message.channel.send(argumentseembed);
    }

        // Get the channel from the arguments provided
        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

        // Make sure the channel is a text channel
        if (!channel || channel.type !== 'text') return message.reply(channeltypeembed);

        try {
            // Get the join channel from the databse
            let a = await db.fetch(`joinchannel_${message.guild.id}`)

            // If the channel is already set, send an error.
            if (channel.id === a) {
                return message.channel.send(channelalreadyexistsembed)
            
            // Else, Set the welcome channel to the arguments provided.
            } else {
                bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send(channelsuccessfullyset)
                db.set(`joinchannel_${message.guild.id}`, channel.id)
                message.channel.send(`**Welcome Channel Has Been Set Successfully in \`${channel.name}\`!**`)
            }

        // Exception Handling
        } catch {
            return message.reply(catchembed);
        }
    }
};
