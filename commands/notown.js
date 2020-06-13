const Discord = require('discord.js'),
	fetch = require('node-fetch');

module.exports = {
	name: 'notown',
	description: 'Finds players with no town',
	execute(message, Town) {
		message.channel.startTyping();
		fetch('https://earthmc.net/map/up/world/earth/')
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				let townless = [];
				let counter = 0;
				data.players.forEach((player) => {
					Town.findOne({ membersArr: { $in: [ player.account ] } }, function(err, town) {
						counter++;
						if (town == null) {
							townless.push(player.account);
						}
						if (counter == data.players.length) {
							let resEmbed = new Discord.MessageEmbed()
								.setTitle('Townless Players')
								.setColor(0x0071bc)
								.setDescription(`**Players [${townless.length}]**\n` + '```' + townless.toString().replace(/,/g, ', ') + '```')
								.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
							message.channel.send(resEmbed);
							message.channel.stopTyping();
						}
					});
				});
			});
	}
};
