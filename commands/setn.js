const Discord = require('discord.js'),
	cache = require('quick.db'),
	fn = require('../util/fn'),
	casst = new cache.table('casst'),
	nationsP = new cache.table('nationsP');

module.exports = {
	name: 'setn',
	description: 'Sets nation information',
	execute: (message, args, Nation) => {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
    let successMessage = new Discord.MessageEmbed().setTitle(':white_check_mark: **Success!**').setColor(0x07bf63).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
    
    if(!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription("You do not have permission to use this command."));
    
		if (!args[2]) return message.channel.send(errorMessage.setDescription('Missing username or UUID. Command usage: 1!setn [type] [nation] <- Missing [value]'));
		if (args[1] == 'delete') {
		} else {
			if (!args[3]) return message.channel.send(errorMessage.setDescription('Missing value, use null to delete. Command usage: 1!setn [type] [nation] [value] <- Missing'));
		}
		let query = args[2].toLowerCase();
		Nation.findOne({ nameLower: query }, function(err, nation) {
			if (nation == null) {
				if (args[1] == 'delete') {
					nationsP.delete(args[2]);
					casst.delete(args[2]);
					message.channel.send(successMessage.setDescription(`Sucessfully cleared the nation's information.`));
				} else {
					return message.channel.send(errorMessage.setDescription('Nation not found'));
				}
			}
			switch (args[1]) {
				case 'amenities':
					let AMNTString = message.content.slice(9 + args[1].length + args[2].length).replace(':NehterPortal:', '<a:NetherPortal:696081909167423567>');
					if (args[3] == 'null') {
						message.channel.send(successMessage.setDescription(`Cleared the nation's amenities`));
						nationsP.delete(`${nation.nameLower}.amenities`);
						return;
					}
					nationsP.set(`${nation.nameLower}.amenities`, AMNTString);
					message.channel.send(successMessage.setDescription(`Set ${nation.nameLower}'s amenities to ${AMNTString}`));
					break;
				case 'discord':
					if (args[3].includes('null')) {
						message.channel.send(successMessage.setDescription(`Cleared the nation's discord`));
						nationsP.delete(`${nation.nameLower}.discord`);
						return;
					}
					if (fn.urlChecker(message.content.slice(9 + args[1].length + args[2].length)) == false) return message.channel.send(errorMessage.setDescription('Invalid URL'));
					nationsP.set(`${nation.nameLower}.discord`, message.content.slice(9 + args[1].length + args[2].length));
					message.channel.send(successMessage.setDescription(`Set ${nation.nameLower}'s discord to ${message.content.slice(9 + args[1].length + args[2].length)}`));
					break;
				case 'img':
					let sliced = message.content.slice(9 + args[1].length + args[2].length);
					if (args[3] == 'null') {
						message.channel.send(successMessage.setDescription(`Cleared the nation's image`));
						nationsP.delete(`${nation.nameLower}.imgLink`);
						return;
					}
					if (sliced.indexOf('wikia') > 0) {
						var linkCDN1 = sliced.replace(/\/revision.*$/gimu, '');
						var linkCDN = linkCDN1.replace('https://', 'https://cdn.statically.io/img/');
						nationsP.set(`${nation.nameLower}.imgLink`, linkCDN);
					} else {
						if (sliced.indexOf('cdn.bcow.tk' > 0)) {
							var linkCDN = sliced;
						} else {
							var linkCDN = sliced.replace('https://', 'https://cdn.statically.io/img/');
						}
						nationsP.set(`${nation.nameLower}.imgLink`, linkCDN);
					}
					message.channel.send(successMessage.setDescription(`Sucessfully set the nation's image`));
					break;
				case 'status':
					casst.set(`${nation.nameLower}`, message.content.slice(9 + args[1].length + args[2].length));
					message.channel.send(successMessage.setDescription('Set ' + args[2] + ' status to ' + message.content.slice(9 + args[1].length + args[2].length)));
					break;
			}
		});
	}
};
