const db = require("quick.db")												// Database
const { MessageEmbed } = require("discord.js")								// Required to create embeds
const chalk = require('chalk');												// Colored Logs
const moment = require('moment');											// Time Formatting

module.exports = async (client, member, guild) => {
	try {
		let guildcount = member.guild.memberCount							// Get the total number of members in the guild

		let modlogchannel = db.fetch(`logs_${member.guild.id}`)				// Fetch the channel to send the member log join log.
		if(modlogchannel === null) return;									// If there is no logging channel, do nothing.

		let joinchannel = db.fetch(`joinchannel_${member.guild.id}`)		// Fetch the welcome channel
		if(joinchannel === null) return;									// If there is no welcome channel, do nothing.

        datecreated = moment(member.user.createdAt).format("DD/MM/YYYY LTS")// Time formatting
		const logembed = new MessageEmbed()									// Embed creation for logging
		.setTitle(`Member joined!`)
		.setDescription(`<@${member.id}> ${guildcount}th to join! \n Account Created ${datecreated}`)
		.setColor(3066993)
		.setFooter(`Member ID: ${member.id}`)
		.setAuthor(member.user.tag, member.user.displayAvatarURL())
		.setTimestamp();

		let joinmsg = `${member.user} has joined the server B)`				
		client.channels.cache.get(joinchannel).send(joinmsg)				// Set the join message
		client.channels.cache.get(modlogchannel).send(logembed)				// Send the logging embed

	} catch {																// Error Handling
		console.log(chalk.red("Something went wrong in the guildMemberAdd Event!"))
	}

}
