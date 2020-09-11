import * as Discord from 'discord.js';

export default (message) => {
  const helpEmbed = new Discord.MessageEmbed()
    .setTitle('1!t - Help')
    .setColor(0x003175)
    .setThumbnail('https://cdn.bcow.xyz/assets/onesearch.png')
    .addField('1!t [town]', 'Gets town info')
    .addField('1!t list', 'Lists all towns by residents')
    .addField('1!t online [town]', 'Lists all online players in the specified town.')
    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');

  message.channel.send(helpEmbed);
  message.channel.stopTyping();
}