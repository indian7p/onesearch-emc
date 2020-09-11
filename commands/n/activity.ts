import * as Discord from 'discord.js';
import { paginator } from '../../functions/paginator';
import { Town, Nation, PlayerP } from '../../models/models';
import { errorMessage } from '../../functions/statusMessage';
import { paginateArray } from '../../functions/list';
import { getPlayer } from '../../functions/fetch';

export default async (message, args) => {
  const actQuery = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');

  const nation = await Nation.findOne({ nameLower: actQuery }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
  if (!nation) {
    message.channel.stopTyping();
    message.channel.send(errorMessage.setDescription('Nation not found.'));
    return;
  }

  const towns = await Town.find({ nation: nation.name }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
  if (!towns) return message.channel.send(errorMessage.setDescription('Towns not found.'));

  let playerList = [];
  for (var i = 0; i < towns.length; i++) {
    const town = towns[i];

    town.membersArr.map(member => playerList.push(member));
  }

  let list = [];
  for (var i = 0; i < playerList.length; i++) {
    let member = playerList[i];

    let data = await getPlayer(member);

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
    let page = pages[i];

    const list = page.toString().replace(/,/g, '\n');
    const emb = new Discord.MessageEmbed()
      .setTitle(`Player Activity - ${nation.name}`)
      .setDescription(`\`\`\`${list}\`\`\``)
      .setColor(0x003175)
      .setFooter(`Page ${i + 1}/${pages.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
    embeds.push(emb);
  }

  message.channel.send(embeds[0]).then((m) => {
    paginator(message.author.id, m, embeds, 0);
  });
  message.channel.stopTyping();
}