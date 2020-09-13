import * as Discord from 'discord.js';
import { Town, TownP, Nation } from '../../models/models';
import { errorMessage } from '../../functions/statusMessage';
import calculateNationBonus from '../../functions/calculateNationBonus';

export default async (message, args) => {
  const query = args[0] == 'town' ? message.content.slice(7).toLowerCase().replace(/ /g, '_') : message.content.slice(4).toLowerCase().replace(/ /g, '_');

  const town = await Town.findOne({ nameLower: query }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

  if (!town) throw 'Nation not found.';

  const townNation = await Nation.findOne({ name: town.nation }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
  const townNationBonus = await calculateNationBonus(townNation);

  const townp = await TownP.findOne({ name: town.name }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
  const imgLink = !townp ? 'https://cdn.bcow.xyz/assets/onesearch.png' : townp.imgLink == null ? 'https://cdn.bcow.xyz/assets/onesearch.png' : townp.imgLink;
  const link = !townp ? null : townp.link;

  const tName = town.capital == true ? `:star: ${town.name} (${town.nation})` : `${town.name} (${town.nation})`;
  const color = town.nation == 'No Nation' ? 0x69a841 : town.color == '#000000' ? 0x010101 : town.color == '#FFFFFF' ? 0xfefefe : town.color;
  const memberList = `\`\`\`${town.members}\`\`\``;
  const maxSize = town.membersArr.length * 8 > 800 ? 800 + townNationBonus : town.membersArr.length * 8 + townNationBonus;

  const resEmbed = new Discord.MessageEmbed()
    .setTitle(tName.replace(/_/g, '\_'))
    .setColor(color)
    .setThumbnail(imgLink)
    .addField('Owner', `\`\`\`${town.mayor}\`\`\``, true)
    .addField('Location', `[${town.x}, ${town.z}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${town.x}&y=64&z=${town.z})`, true)
    .addField('Size', `${town.area}/${maxSize} [NationBonus: ${townNationBonus}]`, true)
    .setTimestamp(town.time)
    .setFooter(`OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');

  if (memberList.length > 1024) {
    let members1 = town.membersArr.slice(1, 50);
    let members2 = town.membersArr.slice(50, 100);

    let members1str = `\`\`\`${members1.toString().replace(/,/g, ', ')}\`\`\``;
    let members2str = `\`\`\`${members2.toString().replace(/,/g, ', ')}\`\`\``;

    if (!link) {
      return resEmbed.addField(`Members [1-50]`, members1str).addField(`Members [51-${town.membersArr.length}]`, members2str);
    } else {
      return resEmbed.addField(`Members [1-50]`, members1str).addField(`Members [51-${town.membersArr.length}]`, members2str).setURL(link);
    }
  } else {
    if (!link) {
      return resEmbed.addField(`Members [${town.membersArr.length}]`, memberList);
    } else {
      return resEmbed.addField(`Members [${town.membersArr.length}]`, memberList).setURL(link);
    }
  }
}