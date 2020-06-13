const Discord = require('discord.js'),
	cache = require('quick.db'),
	casst = new cache.table('casst');

module.exports = {
	name: 'readify',
	description: 'Takes a list and does stuff',
	execute(message) {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		if (message.author.id != '456965312886079533') return message.channel.send('You do not have permission to use this command.');
		let nationsArr = message.content.slice(10).split(',');
		nationsArr.forEach((nation1) => {
			console.log(nation1);
			if (nation1.includes('green_circle1')) {
				casst.set(`${nation1.replace('<:green_circle1:679003758390149222> ', '').toLowerCase()}`, '✅ Safe');
			}
			if (nation1.includes('yellow_circle1')) {
				casst.set(`${nation1.replace('<:yellow_circle1:679004497606868992> ', '').toLowerCase()}`, '🚫 Blocked Off');
			}
			if (nation1.includes('red_circle1')) {
				casst.set(`${nation1.replace('<:red_circle1:679004488312553492> ', '').toLowerCase()}`, '⚠️ Spawn Trap');
				console.log(casst.get(`${nation1.replace('<:red_circle1:679004488312553492> ', '').toLowerCase()}`));
			}
			if (nation1.includes('⚠️')) {
				casst.set(`${nation1.replace('⚠️ ', '').toLowerCase()}`, '⚠️ At Risk Of Being Trapped');
			}
			if (nation1.includes('❔')) {
				casst.set(`${nation1.replace('❔ ', '').toLowerCase()}`, '❔ Unknown');
			}
			if (nation1.includes('lock')) {
				casst.set(`${nation1.replace('<:lock:678629596786065520> ', '').toLowerCase()}`, '<:verified:696564425775251477> Verified');
			}
		});
	}
};
