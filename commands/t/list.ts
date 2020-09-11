import * as Discord from 'discord.js';
import { Town } from "../../models/models";
import { errorMessage } from '../../functions/statusMessage';
import { paginator } from '../../functions/paginator';

export default async (message, sortingOpts) => {
  const towns = await Town.find({}).sort(sortingOpts).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

  if (!towns) return message.channel.send(errorMessage.setDescription('The database is updating, please try again later.'));

  const townList = [];
  for(var i=0; i<towns.length; i++) {
    const town = towns[i];

    townList.push(`${town.name} - Members: ${town.residents} - Area: ${town.area}`);
  }

  const pages = townList.map(() => townList.splice(0, 10)).filter(a => a);
  let embeds = [];

  for(var i=0; i<pages.length; i++) {
    const page = pages[i];

    let list = page.toString().replace(/,/g, '\n');
    let embed = new Discord.MessageEmbed()
      .setTitle('Town List')
      .setDescription(`\`\`\`${list}\`\`\``)
      .setColor(0x003175)
      .setFooter(`Page ${i+1}/${pages.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
    embeds.push(embed);
  }

  message.channel.send(embeds[0]).then((m) => {
    paginator(message.author.id, m, embeds, 0);
  });
  message.channel.stopTyping();
}