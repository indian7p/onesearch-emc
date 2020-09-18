import * as Discord from 'discord.js';
import * as config from '../config.json';
import { paginateArray } from '../functions/list';
import { paginator } from '../functions/paginator';
import { errorMessage } from '../functions/statusMessage';
import { Town, Siege } from '../models/models';

export default {
  name: 'siege',
  description: 'Searches for sieges',
  execute: async (message, args) => {
    if (!config.SIEGE_SEARCH_ENABLED) return;

    const query = message.content.slice(args[0].length + 3).toLowerCase();

    const town = await Town.findOne({ nameLower: query }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

    if (!town) return message.channel.send(errorMessage.setDescription('Town not found.'));

    const sieges = await Siege.find({ $or: [{ attacker: town.name }, { town: town.name }] }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

    if (!town) return message.channel.send(errorMessage.setDescription('No sieges for this town.'));

    let siegeList = sieges.map(siege => `${siege.attacker} <:sword:680868606728601646> ${siege.town}`);

    const pages = await paginateArray(siegeList);

    let embeds = [];
    for (var i = 0; i < pages.length; i++) {
      let page = pages[i];

      const list = page.toString().replace(/,/g, '\n');
      const emb = new Discord.MessageEmbed()
        .setTitle(`Sieges - ${town.name}`)
        .setDescription(`\`\`\`${list}\`\`\``)
        .setColor(0x003175)
        .setFooter(`Page ${i + 1}/${pages.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
      embeds.push(emb);
    }

    message.channel.send(embeds[0]).then((m) => {
      paginator(message.author.id, m, embeds, 0);
    });
  }
};
