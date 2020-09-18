import * as Discord from 'discord.js';
import { paginator } from '../../functions/paginator';
import { Nation, Town } from "../../models/models";
import { errorMessage } from '../../functions/statusMessage';

export default async (message, args) => {
  const query = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');

  const nation = await Nation.findOne({ nameLower: query }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

  if (!nation) {
    message.channel.stopTyping();
    message.channel.send(errorMessage.setDescription('Nation not found.'));
    return;
  }

  const location = nation.location.split(',');

  const towns = await Town.find({ x: { $gt: location[0]*1, $lt: location[0]*1 + 3000}, z: { $gt: location[1]*1, $lt: location[1]*1 + 3000}, nation: 'No Nation' }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

  if (!towns || towns.length <= 0) {
    message.channel.stopTyping();
    message.channel.send(errorMessage.setDescription('No towns found.'));
    return;
  }

  let townList = towns.map(town => `${town.name} - Members: ${town.residents} - Area: ${town.area}`);

  let pages = townList.map(() => townList.splice(0, 10)).filter(a => a);
  let embeds = [];

  for(var i=0; i<pages.length; i++) {
    const page = pages[i];

    let list = page.toString().replace(/,/g, '\n');
    let embed = new Discord.MessageEmbed()
      .setTitle(`Towns In Range - ${nation.name}`)
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