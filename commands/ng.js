const Discord = require('discord.js');
const fn = require('../util/fn');
const { errorMessage } = require('../functions/statusMessage');

module.exports = {
  name: 'ng',
  description: 'Gets info about nation groups.',
  execute: async (message, args, NationGroup) => {
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
          .addField(`Nations [${nationGroup.nations.length}]`, `\`\`\`${nationGroup.nations.toString().replace(/,/g, ', ')}\`\`\``)
          .setFooter(`Page ${i + 1}/${nationGroups.length} | OneSearch`, 'https://cdn.bcow.tk/assets/logo-new.png');

        embeds.push(resEmbed);
      }

      message.channel.send(embeds[0]).then((m) => fn.paginator(message.author.id, m, embeds, 0));
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
          .addField('Leader', nationGroup.leader, true)
          .addField('Size', nationGroup.size, true)
          .addField(`Nations [${nationGroup.nations.length}]`, `\`\`\`${nationGroup.nations.toString().replace(/,/g, ', ')}\`\`\``)
          .setFooter(`Page ${i + 1}/${nationGroups.length} | OneSearch`, 'https://cdn.bcow.tk/assets/logo-new.png');

        embeds.push(resEmbed);
      }

      message.channel.send(embeds[0]).then((m) => fn.paginator(message.author.id, m, embeds, 0));
    }
  }
};
