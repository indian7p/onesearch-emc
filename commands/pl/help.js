const Discord = require('discord.js');

module.exports = (message) => {
  const helpEmbed = new Discord.MessageEmbed()
    .setTitle('1!pl')
    .setColor(0x003175)
    .addField('1!pl [player]', 'Finds player info such as town and scammer status.')
    .addField('1!pl chistory [player]', 'Searches CASST player history, events before Apr 17, 2020 are missing.')
    .addField('1!pl nhistory [player]', 'Gets players name history')
    .addField('1!pl uuid [player]', 'Gets a players UUID')
    .addField('1!pl online [staff/player name/UUID]', 'Shows online players. 1!pl online staff shows online staff and 1!pl online [player] checks if that user is online.')
    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
  message.channel.send(helpEmbed);
}