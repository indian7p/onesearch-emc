const Discord = require('discord.js'),
	fn = require('../util/fn'),
	config = require('../config.json');

module.exports = {
	name: 'setn',
	description: 'Sets nation information',
	execute: (message, args, Nation, NationP) => {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		let successMessage = new Discord.MessageEmbed().setTitle(':white_check_mark: **Success!**').setColor(0x07bf63).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');

		if (!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));

		if (!args[2]) return message.channel.send(errorMessage.setDescription('Missing username or UUID. Command usage: 1!setn [type] [nation] <- Missing [value]'));
		if (args[1] == 'delete') {
		} else {
			if (!args[3]) return message.channel.send(errorMessage.setDescription('Missing value, use null to delete. Command usage: 1!setn [type] [nation] [value] <- Missing'));
		}

		let query = args[2].toLowerCase();

		Nation.findOne({ nameLower: query }, function (err, nation) {
			if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

			if (!nation) return message.channel.send(errorMessage.setDescription('Nation not found'));

			NationP.findOne({ name: nation.nameLower }, function (err, nationp) {
				if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

				switch (args[1]) {
					case 'amenities':
						let AMNTString = message.content.slice(9 + args[1].length + args[2].length).replace(':NehterPortal:', '<a:NetherPortal:696081909167423567>');
						if (args[3] == 'null') {
							if (nationp) {
								nationp.amenities = null;
								nationp.save()
							}
							message.channel.send(successMessage.setDescription(`Cleared the nation's amenities`));
							return;
						}

						if (!nationp) {
							let newDoc = new NationP({
								name: nation.nameLower,
								amenities: AMNTString
							})
							newDoc.save(function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`Set ${nation.nameLower}'s amenities to ${AMNTString}`));
							})
						} else {
							NationP.update({ name: nation.nameLower }, { amenities: AMNTString }, { multi: false }, function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`Set ${nation.nameLower}'s amenities to ${AMNTString}`));
							});
						}
						break;
					case 'link':
						if (args[3].includes('null')) {
							if (nationp) {
								nationp.link = null;
								nationp.save()
							}
							message.channel.send(successMessage.setDescription(`Cleared the nation's discord.`));
							return;
						}

						let link = message.content.slice(9 + args[1].length + args[2].length);

						if (fn.urlChecker(link) == false) return message.channel.send(errorMessage.setDescription('Invalid URL'));

						if (!nationp) {
							let newDoc = new NationP({
								name: nation.nameLower,
								link: link
							})
							newDoc.save(function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`Set ${nation.nameLower}'s discord to ${link}`));
							})
						} else {
							NationP.update({ name: nation.nameLower }, { link: link }, { multi: false }, function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`Set ${nation.nameLower}'s discord to ${link}`));
							});
						}
						break;
					case 'img':
						let sliced = message.content.slice(9 + args[1].length + args[2].length);
						if (args[3] == 'null') {
							if (nationp) {
								nationp.link = null;
								nationp.save()
							}
							message.channel.send(successMessage.setDescription(`Cleared the nation's image.`));
							return;
						}

						let imgLink;
						if (sliced.indexOf('wikia') > 0) {
							var linkCDN1 = sliced.replace(/\/revision.*$/gimu, '');
							imgLink = linkCDN1.replace('https://', 'https://cdn.statically.io/img/');
						} else {
							if (sliced.indexOf('cdn.bcow.tk' > 0)) {
								imgLink = sliced;
							} else {
								imgLink = sliced.replace('https://', 'https://cdn.statically.io/img/');
							}
						}

						if (!nationp) {
							let newDoc = new NationP({
								name: nation.nameLower,
								imgLink: imgLink
							})
							newDoc.save(function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`Sucessfully set the nation's image`));
							})
						} else {
							NationP.update({ name: nation.nameLower }, { imgLink: imgLink }, { multi: false }, function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`Sucessfully set the nation's image`));
							});
						}
						break;
					case 'status':
						if (args[3] == 'null') {
							if (nationp) {
								nationp.status = null;
								nationp.save()
							}
							message.channel.send(successMessage.setDescription(`Cleared the nation's status`));
							return;
						}

						let status = message.content.slice(9 + args[1].length + args[2].length);

						if (!nationp) {
							let newDoc = new NationP({
								name: nation.nameLower,
								status: status
							})
							newDoc.save(function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`'Set ${nation.nameLower}'s status to ${status}`));
							})
						} else {
							NationP.update({ name: nation.nameLower }, { status: status }, { multi: false }, function (err) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
								message.channel.send(successMessage.setDescription(`'Set ${nation.nameLower}'s status to ${status}`));
							});
						}
						break;
				}
			})
		});
	}
};