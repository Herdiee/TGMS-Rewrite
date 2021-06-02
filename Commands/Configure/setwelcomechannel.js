const db = require("quick.db")
const { MessageEmbed } = require('discord.js');
const chalk = require('chalk');

permsembed = new MessageEmbed()
    .setTitle("Error")
    .setDescription("Please make sure you have administrator permissions in this guild.")
    .setColor("#ff0000")
channeltypeembed = new MessageEmbed()
    .setTitle("Error")
    .setDescription("Please make sure that the channel provided is a text channel.")
    .setColor("#ff0000")
argumentseembed = new MessageEmbed()
    .setTitle("Error")
    .setDescription("No Arguments were provided - Please enter a channel name or ID To set.")
    .setColor("#ff0000")
channelalreadyexistsembed = new MessageEmbed()
    .setTitle("Error")
    .setDescription("The channel provided may already be set as a welcome channel")
    .setColor("#ff0000")
catchembed = new MessageEmbed()
    .setTitle("Error")
    .setDescription("Missing permissions or the channel provided was not a text channel as an exception occured.")
    .setColor("#ff0000")
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
    run: async (client, message, args) => {

    if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.reply(permsembed)
        return;
    }
    
    if (!args[0]) {
      let b = await db.fetch(`joinchannel_${message.guild.id}`);
      let channelName = message.guild.channels.cache.get(b);

      if (message.guild.channels.cache.has(b)) {
        return message.channel.send(
          `**New Member Join Channel Set In This Server Is \`${channelName.name}\`!**`
        );

      } else 
        return message.channel.send(argumentseembed);
    }

        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

        if (!channel || channel.type !== 'text') {
            message.reply(channeltypeembed)
            return;
        }

        try {
            let a = await db.fetch(`joinchannel_${message.guild.id}`)

            if (channel.id === a) {
                message.channel.send(channelalreadyexistsembed)
            }

            client.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send(channelsuccessfullyset)
            db.set(`joinchannel_${message.guild.id}`, channel.id)
            message.channel.send(`**Welcome Channel Has Been Set Successfully in \`${channel.name}\`!**`)

        } catch {
            return message.reply(catchembed);
        }
    }
};
