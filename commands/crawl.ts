import * as Discord from 'discord.js';
import * as config from '../config.json';
import * as search from 'youtube-search';
import { errorMessage } from '../functions/statusMessage';
import * as metaget from 'metaget';
import { Result } from '../models/models';

export default {
	name: 'crawl',
	description: 'Gets OpenGraph tags from a website and create a new result.',
	execute: async (message) => {
		if (!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));

		const link = message.content.slice(8);

		async function sendPreview() {
			const data = await Result.findOne({ link: link }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

			let resEmbed = new Discord.MessageEmbed()
				.setTitle(data.name).setURL(data.link)
				.setDescription(data.desc)
				.setThumbnail(data.imgLink)
				.setColor(0x003175)
				.setFooter(`Result Preview | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
			message.channel.send(resEmbed);
		}

		let meta;
		try {
			meta = await metaget.fetch(message.content.slice(8));
		} catch {
			return message.channel.send(errorMessage.setDescription('An error occurred.'));
		}

		if (!meta['og:title']) return message.channel.send(errorMessage.setDescription('Missing og:title tag.'));
		if (!meta['og:description']) return message.channel.send(errorMessage.setDescription('Missing og:description tag.'));
		if (!meta['og:image']) message.channel.send(errorMessage.setDescription('Missing og:image tag.'));

		if (meta['og:site_name'] && meta['og:site_name'].includes('YouTube')) {
			const result = search(meta['og:title'], { maxResults: 1, key: config.YT_API_KEY }).catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

			let newResult = new Result({
				name: `${meta['og:title']} - ${result[0].channelTitle} - ${meta['og:site_name']}`,
				desc: meta['og:description'],
				themeColor: 'ff0000',
				imgLink: result[0].thumbnails.medium.url,
				link: message.content.slice(8)
			});

			await newResult.save();
			sendPreview();
		} else {
			const name = meta['og:site_name'] ? `${meta['og:title']} - ${meta['og:site_name']}` : meta['og:title'];

			let newResult = new Result({
				name: name,
				desc: meta['og:description'],
				imgLink: meta['og:image'].replace('https://', 'https://cdn.statically.io/img/'),
				themeColor: meta['theme-color'],
				link: link
			});

			await newResult.save();
			sendPreview();
		}
	}
};
