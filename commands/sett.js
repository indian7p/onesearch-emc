const Discord = require('discord.js'),
  config = require('../config.json');

module.exports = {
	name: 'sett',
	description: 'Sets town information',
	execute: (message, args, Town, TownP) => {
		let successMessage = new Discord.MessageEmbed().setTitle(':white_check_mark: **Success!**').setColor(0x07bf63).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
    let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
    let helpEmbed = new Discord.MessageEmbed()
			.setTitle('1!sett')
			.setDescription('Using `null` as the value will clear that type.')
			.setColor(0x003175)
			.addField('1!setpl img', 'Sets a towns image')
			.addField('1!setpl rating', 'Sets a towns Shootcity rating')
			.addField('1!setpl link', 'Sets a towns link')
			.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
    
		if(!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription("You do not have permission to use this command."));
    
		let query = args[2].toLowerCase();
		Town.findOne({ nameLower: query }, function(err, town) {
			if(err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

			TownP.findOne({ name: town.name }, function(err, townp) {
				if(err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

				switch (args[1]) {
					case 'img':
						if (args[3] == 'null') {
							if (townp) {
								townp.imgLink = null;
								townp.save();
							}
							message.channel.send(successMessage.setDescription(`Cleared the town's image.`));
						}

						let imgLink = message.content.slice(9 + args[1].length + args[2].length).replace(/^(http|https):\/\//, 'https://cdn.statically.io/img/');
						if (!townp) {
							let newDoc = new TownP({
								name: town.name,
								imgLink: imgLink
							})
							newDoc.save(function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`Successfully set the town's image.`));
							})
						} else {
							NationP.update({ name: town.name }, { imgLink: imgLink }, { multi: false }, function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`Successfully set the town's image.`));
							});
						}
						break;
					case 'rating':
						if (args[3] == 'null') {
							if (townp) {
								townp.scrating = null;
								townp.save();
							}
							message.channel.send(successMessage.setDescription(`Cleared the town's rating.`));
						}

						let rating = message.content.slice(9 + args[2].length + args[1].length);
						if (!townp) {
							let newDoc = new TownP({
								name: town.name,
								scrating: rating
							})
							newDoc.save(function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`Successfully set the town's rating.`));
							})
						} else {
							NationP.update({ name: town.name }, { scrating: rating }, { multi: false }, function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`Successfully set the town's rating.`));
							});
						}
						break;
					case 'link':
						if (args[3] == 'null') {
							if (townp) {
								townp.link = null;
								townp.save();
							}
							message.channel.send(successMessage.setDescription(`Cleared the town's link.`));
						}

						let link = message.content.slice(9 + args[2].length + args[1].length);
						if (!townp) {
							let newDoc = new TownP({
								name: town.name,
								link: link
							})
							newDoc.save(function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`Successfully set the town's link.`));
							})
						} else {
							NationP.update({ name: town.name }, { link: link }, { multi: false }, function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`Successfully set the town's link.`));
							});
						}
						break;
					default:
						message.channel.send(helpEmbed)
						break;
				}
			})
		});
	}
};