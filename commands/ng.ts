import * as Discord from 'discord.js';
import { errorMessage } from '../functions/statusMessage';
import { paginator } from '../functions/paginator';
import { NationGroup } from '../models/models';

export default {
  name: 'ng',
  description: 'Gets info about nation groups.',
  execute: async (message, args) => {
    const query = message.content.slice(args[0].length + 3).toLowerCase();

    if (!args[1]) {
      let embeds = [];

      const nationGroups = await NationGroup.find({}).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

      for (var i = 0; i < nationGroups.length; i++) {
        const nationGroup = nationGroups[i];

        let resEmbed = new Discord.MessageEmbed()
          .setTitle(nationGroup.name)
          .setURL(nationGroup.link)
          .setColor(0x003175)
          .setDescription(nationGroup.desc)
          .setThumbnail(nationGroup.imgLink)
          .addField('Leader', `\`\`\`${nationGroup.leader}\`\`\``, true)
          .addField('Size', nationGroup.size, true)
          .addField(`Members`, nationGroup.members, true)
          .addField(`Nations [${nationGroup.nations.length}]`, `\`\`\`${nationGroup.nations.toString().replace(/,/g, ', ')}\`\`\``)
          .setFooter(`Page ${i + 1}/${nationGroups.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');

        embeds.push(resEmbed);
      }

      message.channel.send(embeds[0]).then((m) => paginator(message.author.id, m, embeds, 0));
    } else {
      let embeds = [];

      const nationGroups = await NationGroup.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

      for (var i = 0; i < nationGroups.length; i++) {
        const nationGroup = nationGroups[i];

        let resEmbed = new Discord.MessageEmbed()
          .setTitle(nationGroup.name)
          .setURL(nationGroup.link)
          .setColor(0x003175)
          .setDescription(nationGroup.desc)
          .setThumbnail(nationGroup.imgLink)
          .addField('Leader', `\`\`\`${nationGroup.leader}\`\`\``, true)
          .addField('Size', nationGroup.size, true)
          .addField(`Members`, nationGroup.members, true)
          .addField(`Nations [${nationGroup.nations.length}]`, `\`\`\`${nationGroup.nations.toString().replace(/,/g, ', ')}\`\`\``)
          .setFooter(`Page ${i + 1}/${nationGroups.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');

        embeds.push(resEmbed);
      }

      if (embeds.length == 0) {
        message.channel.send(errorMessage.setDescription('No results found.'));
      } else {
        message.channel.send(embeds[0]).then((m) => paginator(message.author.id, m, embeds, 0));
      }
    }
  }
};
