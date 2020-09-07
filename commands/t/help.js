const Discord = require('discord.js');

module.exports = (message) => {
  const helpEmbed = new Discord.MessageEmbed()
    .setTitle('1!t - Help')
    .setColor(0x003175)
    .setThumbnail('https://cdn.bcow.tk/assets/neu-os-logo-circle.png')
    .addField('1!t [town]', 'Gets town info')
    .addField('1!t list', 'Lists all towns by residents')
    .addField('1!t online [town]', 'Lists all online players in the specified town.')
    .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png');

  message.channel.send(helpEmbed);
  message.channel.stopTyping();
}