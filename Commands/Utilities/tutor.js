// Dependencies
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const chalk = require('chalk');

// Cooldown set and configuration file path
const config = require("../../config.json");
const abusePrevention = new Set();

module.exports = {
    name: 'tutor',
    description: 'Request help from a tutor',
    aliases: ['helpme','needhelp','sendnerd','huw'],
    run: async (client, message, args) => {
        
        // If the author used the command recently
        if (abusePrevention.has(message.author.id)) {
            // Reply with an error message
            errorembed = new MessageEmbed()
            .setTitle("Error")
            .setDescription("To prevent abuse, the tutor command has a 10 minute cooldown.")
            .setColor("#ff0000")
            message.reply(errorembed)

        // If the author has not used the command recently
        } else {
        // Get the message arguments
        const msgcontent = args.slice(0).join(' ');
        // Define the help message
        let helpmsg = "```\n" + msgcontent + "\n```"
        // Send the message to the channel
        message.channel.send(`<@&${config.tutor_role}> please help ${message.author} with  ${helpmsg}`)
 
        // Add the message author to the set
        abusePrevention.add(message.author.id);
        setTimeout(() => {
           // Remove the user from the set after 10 mninutes
           abusePrevention.delete(message.author.id);
         }, 600000);
        }
}
}