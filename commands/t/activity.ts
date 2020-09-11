import * as Discord from 'discord.js';
import { paginator } from '../../functions/paginator';
import { Town, PlayerP } from '../../models/models';
import { errorMessage } from '../../functions/statusMessage';
import { paginateArray } from '../../functions/list';
import { getPlayer } from '../../functions/fetch';

export default async (message, args) => {
  const actQuery = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');

  const town = await Town.findOne({ nameLower: actQuery }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

  if (!town) {
    message.channel.stopTyping();
    return message.channel.send(errorMessage.setDescription('Town not found.'));
  }

  let list = [];
  for (var i = 0; i < town.membersArr.length; i++) {
    const member = town.membersArr[i];

    const data = await getPlayer(member).catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
    if (data.success != false) {
      const player = await PlayerP.findOne({ uuid: data.data.player.raw_id }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

      list.push(player == null ? `${member} - Last On: No data` : `${member} - Last On: ${player.lastOnline}`);
    } else {
      list.push(`${member} - Last On: No data`);
    }
  }

  const pages = await paginateArray(list);
  let embeds = [];

  for (var i = 0; i < pages.length; i++) {
    const page = pages[i];

    const list = page.toString().replace(/,/g, '\n');
    const emb = new Discord.MessageEmbed()
      .setTitle(`Player Activity - ${town.name}`)
      .setDescription(`\`\`\`${list}\`\`\``)
      .setColor(0x003175)
      .setFooter(`Page ${i+1}/${pages.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
    embeds.push(emb);
  }

  message.channel.send(embeds[0]).then((m) => {
    paginator(message.author.id, m, embeds, 0);
  });
  message.channel.stopTyping();
}