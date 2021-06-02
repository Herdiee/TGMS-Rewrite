const { MessageEmbed } = require("discord.js")
const chalk = require('chalk');
const moment = require('moment');

module.exports = async (client, member, guild) => {
	try {
		let guildcount = member.guild.memberCount

		const logembed = new MessageEmbed()
			.setTitle(`Member Left!`)
			.setDescription(`<@${member.id}> left.`)
			.setColor("#ff0000")
			.setFooter(`Member ID: ${member.id}`)
			.setAuthor(member.user.tag, member.user.displayAvatarURL())
			.setTimestamp();

		let leavemsg = `${member.user} has left the server B(`
		client.channels.cache.get(client.config.welcome_channel).send(leavemsg)
		client.channels.cache.get(client.config.modlog_channel).send(logembed)

	} catch {
		console.log(chalk.red("Something went wrong in the guildMemberRemove Event!"))
	}

}
