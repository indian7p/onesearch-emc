const Discord = require('discord.js');

module.exports = (message) => {
  const helpEmbed = new Discord.MessageEmbed()
  .setTitle('1!n - Help')
  .addField('1!n [nation]', 'Gets nation info')
  .addField('1!n list [members/area]', 'Lists all nations by residents')
  .addField('1!n online [nation]', 'Lists all online players in a specified nation.')
  .setColor(0x003175)
  .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');

  message.channel.send(helpEmbed);
  message.channel.stopTyping();
}