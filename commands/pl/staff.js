const Discord = require('discord.js');
const staffList = require('../../staffList.json');

module.exports = (message) => {
  const staffArray = staffList.staffList;

  const embed = new Discord.MessageEmbed()
    .setTitle('Players - Staff')
    .setColor(0x003175)
    .setDescription('List inaccurate? Open a pull request or issue on [GitHub](https://github.com/imabritishcow/onesearch-emc).')
    .addField(`Staff [${staffArray.length}]`, `\`\`\`${staffArray.toString().replace(/,/g, ', ')}\`\`\``)
    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
  message.channel.send(embed);
}