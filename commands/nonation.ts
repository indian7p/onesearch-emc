import * as Discord from 'discord.js';
import { errorMessage } from '../functions/statusMessage';
import { paginator } from '../functions/paginator';
import { Town, Nation } from '../models/models';

export default {
	name: 'nonation',
	description: 'Searches for towns without nations',
	execute: async (message, args) => {
		message.channel.startTyping();

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

		const towns = await Town.find({ nation: 'No Nation' }).sort(sortingOpts).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

		if (!towns) return message.channel.send(errorMessage.setDescription('The database may be updating. Try again later.'));

		const nation = await Nation.findOne({ name: "No_Nation" }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

		if (!nation) return message.channel.send(errorMessage.setDescription('The database may be updating. Try again later.'));

		const townList = towns.map(town => `${town.name.replace(/_/g, '\_')} - Members: ${town.residents} - Area: ${town.area}`)

		const pages = townList.map(() => townList.splice(0, 10)).filter(a => a);
		
		let embeds = [];
		for (var i = 0; i < pages.length; i++) {
			const page = pages[i];
			
			let list = page.toString().replace(/,/g, '\n');
			let embed = new Discord.MessageEmbed()
				.setTitle('No Nation')
				.addField('Towns', townList.length, true)
				.addField('Residents', nation.residents, true)
				.setDescription(`\`\`\`${list}\`\`\``)
				.setColor(0x003175)
				.setFooter(`Page ${i + 1}/${pages.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
			embeds.push(embed);
		}

		message.channel.send(embeds[0]).then((m) => {
			paginator(message.author.id, m, embeds, 0);
		});
		message.channel.stopTyping();
	}
};