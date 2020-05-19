const Discord = require('discord.js');
const cache = require('quick.db');
const casst = new cache.table('casst');

module.exports = {
	name: 'listscammers',
	description: 'Finds nations without CASST statuses',
	execute: (message, args, Nation) => {
		if (message.author.id != '456965312886079533') return message.channel.send('You do not have permission to use this command.');
		let nations3s = [];
		Nation.find({}, function(err, nations2) {
			let counter2 = 0;
			nations2.forEach((nation) => {
				nations3s.push(nation.name);
				nations3s.push(nation.nameLower);
				counter2++;
				if (counter2 == nations2.length) {
					casst.all().forEach((player) => {
						if (nations3s.includes(player.ID)) {
						} else {
							let playerRes = fetch(`https://playerdb.co/api/player/minecraft/${player.ID}`)
								.then((res) => {
									return res.json();
								})
								.then((data) => {
									let resEmbed = new Discord.MessageEmbed()
										.setTitle(data.data.player.username)
										.setURL(`https://namemc.com/${player.ID}`)
										.setThumbnail(`https://crafatar.com/avatars/${player.ID}?overlay`)
										.setColor(0x019145)
										.setDescription(player.data.replace(/"/g, ''))
										.setFooter('CASST', 'https://cdn.bcow.tk/assets/casst.png');
									message.channel.send(resEmbed);
								});
						}
					});
				}
			});
		});
	}
};
