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

        datecreated = moment(member.user.createdAt).format("DD/MM/YYYY LTS")
		const logembed = new MessageEmbed()
		.setTitle(`Member joined!`)
		.setDescription(`<@${member.id}> ${guildcount}th to join! \n Account Created ${datecreated}`)
		.setColor(3066993)
		.setFooter(`Member ID: ${member.id}`)
		.setAuthor(member.user.tag, member.user.displayAvatarURL())
		.setTimestamp();

		let joinmsg = `${member.user} has joined the server B)`				
		client.channels.cache.get(joinchannel).send(joinmsg)
		client.channels.cache.get(modlogchannel).send(logembed)

	} catch {
		console.log(chalk.red("Something went wrong in the guildMemberAdd Event!"))
	}

}
