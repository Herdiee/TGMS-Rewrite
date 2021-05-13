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

		// Fetch the channel where the welcome message should be sent
		let joinchannel = db.fetch(`joinchannel_${member.guild.id}`)
		// If there is no welcome channel, do nothing.
		if(joinchannel === null) return;
		
        // Embed creation for logging
        datecreated = moment(member.user.createdAt).format("DD/MM/YYYY LTS")
		const logembed = new MessageEmbed()
		.setTitle(`Member joined!`)
		.setDescription(`<@${member.id}> ${guildcount}th to join! \n Account Created ${datecreated}`)
		.setColor(3066993)
		.setFooter(`Member ID: ${member.id}`)
		.setAuthor(member.user.tag, member.user.displayAvatarURL())
		.setTimestamp();

		// Create and Send a welcome message
		client.channels.cache.get(joinchannel).send(`${member.user} has joined the server B)`)

		// Send the logging embed
		client.channels.cache.get(modlogchannel).send(logembed)

	} catch {
		console.log(chalk.red("Something went wrong in the guildMemberAdd Event!"))
	}

}
