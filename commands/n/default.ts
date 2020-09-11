import * as Discord from 'discord.js';
const { Nation, NationP } = require('../../models/models');

export default async (message, args) => {
  let query = message.content.slice(args[0].length + 3).toLowerCase().replace(/ /g, '_');

  const nation = await Nation.findOne({ nameLower: query }).exec().catch(err => { throw err; });
  if (!nation) throw 'Nation not found.';

  const nationp = await NationP.findOne({ name: nation.nameLower }).exec().catch(err => { throw err; });

  const status = !nationp ? ':grey_question: Unknown' : !nationp.status ? ':grey_question: Unknown' : nationp.status;
  const imgLink = !nationp ? 'https://cdn.bcow.xyz/assets/onesearch.png' : !nationp.imgLink ? 'https://cdn.bcow.xyz/assets/onesearch.png' : nationp.imgLink;
  const nationName = !nationp ? nation.name : status == '<:verified:726833035999182898> Verified' ? `<:verified:726833035999182898> ${nation.name.replace(/_/g, '\_')}` : nation.name.replace(/_/g, '\_');
  const nationLink = nationp ? nationp.link : null;
  const nationAMNT = nationp ? nationp.amenities : 'Information may be slightly out of date.';
  const location = nation.location.split(',');

  const val = nation.residents;
  let nationBonus;
  switch (true) {
    case (val >= 0 && val <= 9):
      nationBonus = 10;
      break;
    case (val >= 10 && val <= 19):
      nationBonus = 20;
      break;
    case (val >= 20 && val <= 29):
      nationBonus = 40;
      break;
    case (val >= 30 && val <= 39):
      nationBonus = 60;
      break;
    case (val >= 40 && val <= 49):
      nationBonus = 100;
      break;
    case (val >= 50):
      nationBonus = 140;
      break;
  }

  const resEmbedN = new Discord.MessageEmbed()
    .setTitle(nationName.replace(/_/g, '\_'))
    .setDescription(nationAMNT)
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