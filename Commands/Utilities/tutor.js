const Discord = require('discord.js');                                                      // Discord API Wrapper
const { MessageEmbed } = require('discord.js');                                             // Required for embed creation
const chalk = require('chalk');                                                             // Colored Terminal

const config = require("../../config.json");                                                // Config File
const abusePrevention = new Set();                                                          // New set for command cooldown

errorembed = new MessageEmbed()
    .setTitle("Error")
    .setDescription("To prevent abuse, the tutor command has a 10 minute cooldown.")
    .setColor("#ff0000")

module.exports = {
    name: 'tutor',
    description: 'Request help from a tutor',
    aliases: ['helpme','needhelp','sendnerd','huw'],
    run: async (client, message, args) => {
        
        if (abusePrevention.has(message.author.id)) {                               // If the author used the command recently
            message.reply(errorembed)                                               // Reply with an error message
        } 

        try {                                                                       // If the author has not used the command recently
            const msgcontent = args.slice(0).join(' ');                             // Get the message arguments    
            let helpmsg = "```\n" + msgcontent + "\n```"                            // Define the help message
            message.channel.send(`<@&${config.tutor_role}> please help ${message.author} with  ${helpmsg}`)
    
            abusePrevention.add(message.author.id);                                 // Add the message author to the set
            setTimeout(() => {
            abusePrevention.delete(message.author.id);                              // Remove the user from the set after 10 mninutes
            }, 600000);    
        } catch (error) {
            console.log(error.message)
        }
}
}