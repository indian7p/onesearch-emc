const Discord = require('discord.js');
const {embed, errorMessage} = require('../functions/statusMessage');
const {getPlayerCount, getMapData} = require('../functions/fetch');

module.exports = {
  name: "queue",
  description: 'Shows current queue info',
  execute: async (message) => {
    message.channel.startTyping();
    let server = await getPlayerCount();

    let mapData = await getMapData().catch(err => {
      message.channel.stopTyping();
      message.channel.send(errorMessage.setDescription('Error occurred while getting map data.'));
    });
    
    const queue = server.players.now - mapData.currentcount < 0 ? 0 : server.players.now - mapData.currentcount;
    
    let queueEmbed = new Discord.MessageEmbed()
      .setTitle('Queue')
      .setColor(0x003175)
      .setThumbnail('https://cdn.bcow.tk/logos/EarthMC.png')
      .addField('Server Total', `${server.players.now}/${server.players.max}`)
      .addField('In Queue', queue, true)
      .addField('Towny', `${mapData.currentcount >= 100 ? `**FULL** ${mapData.currentcount}` : mapData.currentcount}/100`, true)
      .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
    
    message.channel.send(queueEmbed);
    message.channel.stopTyping();
  }
}