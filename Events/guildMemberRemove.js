const db = require("quick.db")
const { MessageEmbed } = require("discord.js")
const chalk = require('chalk');
const moment = require('moment');

module.exports = async (client, member, guild) => {
	try {
		let guildcount = member.guild.memberCount

		let modlogchannel = db.fetch(`logs_${member.guild.id}`)
        if(modlogchannel === null) return;
		let joinchannel = db.fetch(`joinchannel_${member.guild.id}`)
		if(joinchannel === null) return;
		
		const logembed = new MessageEmbed()
			.setTitle(`Member Left!`)
			.setDescription(`<@${member.id}> left.`)
			.setColor("#ff0000")
			.setFooter(`Member ID: ${member.id}`)
			.setAuthor(member.user.tag, member.user.displayAvatarURL())
			.setTimestamp();

		client.channels.cache.get(joinchannel).send(`${member.user} has left the server B(`)
		client.channels.cache.get(modlogchannel).send(logembed)

	} catch {
		console.log(chalk.red("Something went wrong in the guildMemberRemove Event!"))
	}

}
