const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const chalk = require('chalk');

const config = require("../../config.json");
const abusePrevention = new Set();

errorembed = new MessageEmbed()
    .setTitle("Error")
    .setDescription("To prevent abuse, the tutor command has a 10 minute cooldown.")
    .setColor("#ff0000")

module.exports = {
    name: 'tutor',
    description: 'Request help from a tutor',
    aliases: ['helpme','needhelp','sendnerd','huw'],
    run: async (client, message, args) => {
        
        if (abusePrevention.has(message.author.id)) {
            message.reply(errorembed)
        } 

        try { 
            const msgcontent = args.slice(0).join(' ');  
            let helpmsg = "```\n" + msgcontent + "\n```" 
            message.channel.send(`<@&${config.tutor_role}> please help ${message.author} with  ${helpmsg}`)
    
            abusePrevention.add(message.author.id);
            setTimeout(() => {
            abusePrevention.delete(message.author.id);
            }, 600000);    
        } catch (error) {
            console.log(error.message)
        }
}
}