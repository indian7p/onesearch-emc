import * as Discord from 'discord.js';
import calculateNationBonus from '../../functions/calculateNationBonus';
import { Nation, NationP } from '../../models/models';
import { errorMessage } from '../../functions/statusMessage';

export default async (message, args) => {
  let query = message.content.slice(args[0].length + 3).toLowerCase().replace(/ /g, '_');

  const nation = await Nation.findOne({ nameLower: query }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
  if (!nation) throw 'Nation not found.';

  const nationp = await NationP.findOne({ name: nation.nameLower }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

  const status = !nationp ? ':grey_question: Unknown' : !nationp.status ? ':grey_question: Unknown' : nationp.status;
  const imgLink = !nationp ? 'https://cdn.bcow.xyz/assets/onesearch.png' : !nationp.imgLink ? 'https://cdn.bcow.xyz/assets/onesearch.png' : nationp.imgLink;
  const nationName = !nationp ? nation.name : status == '<:verified:726833035999182898> Verified' ? `<:verified:726833035999182898> ${nation.name.replace(/_/g, '\_')}` : nation.name.replace(/_/g, '\_');
  const nationLink = nationp ? nationp.link : null;
  const location = nation.location.split(',');

  const nationBonus = await calculateNationBonus(nation);

  const resEmbedN = new Discord.MessageEmbed()
    .setTitle(nationName.replace(/_/g, '\_'))
    .setURL(nationLink)
    .setColor(nation.color)
    .setThumbnail(imgLink)
    .addField('Owner', `\`\`\`${nation.owner}\`\`\``, true)
    .addField('Capital', nation.capital, true)
    .addField('Status', status, true)
    .addField('Residents', nation.residents, true)
    .addField('Area', nation.area, true)
    .addField('Nation Bonus', nationBonus, true)
    .addField('Location', `[${location[0]}, ${location[1]}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${location[0]}&y=64&z=${location[1]})`, true)
    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');

  const townsList = nation.townsArr.toString().replace(/,/g, ', ');
  if (townsList.length > 1024) {
    let members1 = nation.townsArr.slice(1, 50);
    let members2 = nation.townsArr.slice(50, 100);

    members1 = `\`\`\`${members1.toString().replace(/,/g, ', ')}\`\`\``;
    members2 = `\`\`\`${members2.toString().replace(/,/g, ', ')}\`\`\``;

    return resEmbedN.addField(`Towns [1-50]`, members1).addField(`Towns [51-${nation.townsArr.length}]`, members2);
  } else {
    return resEmbedN.addField(`Towns [${nation.townsArr.length}]`, `\`\`\`${townsList}\`\`\``);
  }
}