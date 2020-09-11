import * as Discord from 'discord.js';
import { errorMessage } from '../functions/statusMessage';
import { paginator } from '../functions/paginator';

export default {
	name: 'nonation',
	description: 'Searches for towns without nations',
	execute(message, args, Town, Nation, client) {
		message.channel.startTyping();
		Nation.findOne({ nameLower: 'no_nation' }, function (err, nation) {
			if (nation == null) {
				message.channel.stopTyping();
				message.channel.send(errorMessage.setDescription('The database may be updating, try again in a minute.'));
			}
		});

		let sortingOpts;
		switch (args[1]) {
			default:
			case 'members':
				sortingOpts = { residents: 'desc' };
				break;
			case 'area':
				sortingOpts = { area: 'desc' };
				break;
		}

		Town.find({ nation: 'No Nation' }).sort(sortingOpts).exec(async function (err, towns) {
			if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
			if (!towns) return message.channel.send(errorMessage.setDescription('The database may be updating. Try again later.'));
			Nation.findOne({ name: "No_Nation" }, function (err, nation) {
				if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
				if (!nation) return message.channel.send(errorMessage.setDescription('The database may be updating. Try again later.'));

				let townList = [];
				towns.forEach(town => {
					townList.push(`${town.name.replace(/_/g, '\_')} - Members: ${town.residents} - Area: ${town.area}`);
				})

				let pages = townList.map(() => townList.splice(0, 10)).filter(a => a);
				let embeds = [];

				let pageNum = 0;
				pages.forEach(page => {
					pageNum++
					let list = page.toString().replace(/,/g, '\n');
					let embed = new Discord.MessageEmbed()
						.setTitle('No Nation')
						.addField('Towns', townList.length, true)
						.addField('Residents', nation.residents, true)
						.setDescription(`\`\`\`${list}\`\`\``)
						.setColor(0x003175)
						.setFooter(`Page ${pageNum}/${pages.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
					embeds.push(embed);
				})

				message.channel.send(embeds[0]).then((m) => {
					paginator(message.author.id, m, embeds, 0);
				});
				message.channel.stopTyping();
			})
		})
	}
};