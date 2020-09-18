import * as Discord from 'discord.js';
import * as fs from 'fs';

let commands = {};
const commandFiles = fs.readdirSync('./help/').filter((file) => file.endsWith('.json'));
for (const file of commandFiles) {
	const command = require(`../help/${file}`);

	commands[command.embed.title] = command;
}

export default {
	name: 'help',
	description: 'Shows bot commands',
	execute(message, args) {
		switch (args[1]) {
			default:
				const helpEmbed = new Discord.MessageEmbed()
					.setTitle('Help')
					.setDescription('Join my [discord](https://discord.gg/mXrTXhB)!')
					.setThumbnail('https://cdn.bcow.xyz/assets/onesearch.png')
					.setColor(0x003175)
					.addField('1!help [command]', 'Shows info about a command')
					.addField('1!info', 'Shows bot info')
					.addField('1!queue', 'Shows current queue info.')
					.addField('1!s [search term]', 'Search OneSearch for towns, nations, discords, and more.')
					.addField('1!n [nation]', 'Finds nation information')
					.addField('1!nonation', 'Gets towns without a nation')
					.addField('1!t [town]', 'Finds town information')
					.addField('1!notown', 'Gets towns without a nation')
					.addField('1!pl [username or UUID]', 'Gets player information')
					.setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
				message.channel.send(helpEmbed);
				break;
			case 'crawl':
				message.channel.send(commands['1!crawl'])
				break;
			case 'help':
				message.channel.send(commands['1!help'])
				break;
			case 'info':
				message.channel.send(commands['1!info'])
				break;
			case 'link':
				message.channel.send(commands['1!link'])
				break;
			case 'listaudit':
				message.channel.send(commands['1!listaudit'])
				break;
			case 'n':
			case 'nation':
				message.channel.send(commands['1!n'])
				break;
			case 'ng':
				message.channel.send(commands['1!ng'])
				break;
			case 'nonation':
				message.channel.send(commands['1!nonation'])
				break;
			case 'townless':
			case 'notown':
				message.channel.send(commands['1!notown'])
				break;
			case 'pl':
			case 'player':
				message.channel.send(commands['1!pl'])
				break;
			case 'queue':
				message.channel.send(commands['1!queue'])
				break;
			case 's':
			case 'search':
				message.channel.send(commands['1!s'])
				break;
			case 'setn':
				message.channel.send(commands['1!setn'])
				break;
			case 'setpl':
				message.channel.send(commands['1!setpl'])
				break;
			case 'setprofile':
				message.channel.send(commands['1!setprofile'])
				break;
			case 'sett':
				message.channel.send(commands['1!sett'])
				break;
			case 'stats':
				message.channel.send(commands['1!stats'])
				break;
			case 't':
			case 'town':
				message.channel.send(commands['1!town'])
				break;
		}
	}
};
