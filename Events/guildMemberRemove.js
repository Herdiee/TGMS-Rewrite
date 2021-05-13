// Dependencies
const db = require("quick.db")
const { MessageEmbed } = require("discord.js")
const chalk = require('chalk');
const moment = require('moment');

module.exports = async (client, member, guild) => {
	try {
		// Get the total number of members in the guild
		let guildcount = member.guild.memberCount

		// Fetch the channel to send the member log join log.
		let modlogchannel = db.fetch(`logs_${member.guild.id}`)
		// If there is no logging channel, do nothing.
        if(modlogchannel === null) return;

		// Fetch the channel where the leave message should be sent
		let joinchannel = db.fetch(`joinchannel_${member.guild.id}`)
		// If there is no welcome channel, do nothing.
		if(joinchannel === null) return;
		
        // Embed creation for logging
		const logembed = new MessageEmbed()
		.setTitle(`Member Left!`)
		.setDescription(`<@${member.id}> left.`)
		.setColor("#ff0000")
		.setFooter(`Member ID: ${member.id}`)
		.setAuthor(member.user.tag, member.user.displayAvatarURL())
		.setTimestamp();

		// Create and Send the leaving message
		client.channels.cache.get(joinchannel).send(`${member.user} has left the server B(`)

		// Send the logging embed
		client.channels.cache.get(modlogchannel).send(logembed)

	} catch {
		console.log(chalk.red("Something went wrong in the guildMemberRemove Event!"))
	}

}
