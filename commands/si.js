const Discord = require('discord.js'),
	moment = require('moment-timezone'),
	fn = require('../util/fn');

module.exports = {
	name: 'si',
	description: 'Searches OneSearch for images',
	execute(message, args, Image) {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		if (!args[1]) return message.channel.send(errorMessage.setDescription('No search query'));
		let query = message.content.slice(4).toLowerCase();

    let embeds = [];

		Image.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).then(async (results) => {
			let pageNum = 0;
			let NSFWcount = 0;
			await results.forEach((data) => {
				pageNum++;
        let resEmbed = new Discord.MessageEmbed()
        .setTitle('Image')
        .setColor(0x0b59a4)
        .setDescription(data.desc)
        .addField('Info', data.meta)
        .setImage(data.link)
        .setFooter(`Page ${pageNum}/${results.length} | OneSearch`, 'https://cdn.bcow.tk/assets/logo-new.png');
				if (data.nsfw != undefined) {
					if (message.channel.type == 'dm') {
						embeds.push(resEmbed);
					} else {
						NSFWcount++;
						message.author.send(resEmbed);
					}
				} else {
					embeds.push(resEmbed);
				}
			});
			if (embeds.length == 0) {
				message.channel.send(errorMessage.setDescription('No results found.'));
			} else {
				if (NSFWcount > 0) {
					message.channel.send(NSFWcount + ' NSFW result(s) sent to your DMs.');
				}
				message.channel.send(embeds[0]).then((m) => fn.paginator(message.author.id, m, embeds, 0));
			}
		});
	}
};
