import * as Discord from 'discord.js';
import { paginator } from '../../functions/paginator';
import { Nation } from "../../models/models";
import { errorMessage } from '../../functions/statusMessage';

export default async (message, sortingOpts) => {
  const nations = await Nation.find({}).sort(sortingOpts).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
  if (!nations) return message.channel.send(errorMessage.setDescription('The database may be updating. Try again later.'));

  let nationList = [];
  for (var i = 0; i < nations.length; i++) {
    const nation = nations[i];

    nationList.push(`${nation.name.replace(/_/g, '\_')} - Members: ${nation.residents} - Area: ${nation.area}`);
  }

  let pages = nationList.map(() => nationList.splice(0, 10)).filter(a => a);
  let embeds = [];

  for(var i=0; i<pages.length; i++) {
    const page = pages[i];

    let list = page.toString().replace(/,/g, '\n');
    let embed = new Discord.MessageEmbed()
      .setTitle('Nation List')
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