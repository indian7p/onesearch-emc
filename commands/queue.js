const Discord = require('discord.js');
const {errorMessage} = require('../functions/statusMessage');
const {getPlayerCount, getMapData, getBetaMap, getClassicMap} = require('../functions/fetch');

module.exports = {
  name: "queue",
  description: 'Shows current queue info',
  execute: async (message, client) => {
    message.channel.startTyping();
    let server = await getPlayerCount();

    if (server.players.now < 0) {
      message.channel.send(errorMessage.setDescription('Error getting server info.'));
    }

    let mapData = await getMapData().catch(err => {
      message.channel.stopTyping();
      message.channel.send(errorMessage.setDescription('Error occurred while getting map data.'));
      return;
    });

    const betaMapData = await getBetaMap().catch(err => {
      message.channel.stopTyping();
      message.channel.send(errorMessage.setDescription('Error occurred while getting map data.'));
      return;
    });
  
    const classicMapData = await getClassicMap().catch(err => {
      message.channel.stopTyping();
      message.channel.send(errorMessage.setDescription('Error occurred while getting map data.'));
      return;
    });
    
    const queue = server.players.now - mapData.currentcount - betaMapData.currentcount - classicMapData.currentcount < 0 ? 0 : server.players.now - mapData.currentcount;
    
    let queueEmbed = new Discord.MessageEmbed()
      .setTitle('Queue')
      .setColor(0x003175)
      .setThumbnail('https://cdn.bcow.tk/logos/EarthMC.png')
      .addField('Server Total', `${server.players.now}/${server.players.max}`)
      .addField('In Queue for Towny', queue)
      .addField('Towny', `${mapData.currentcount >= 100 ? `**FULL** ${mapData.currentcount}` : mapData.currentcount}/100`, true)
      .addField('Beta', `${betaMapData.currentcount >= 60 ? `**FULL** ${betaMapData.currentcount}` : betaMapData.currentcount}/60`, true)
      .addField('Classic', `${classicMapData.currentcount >= 100 ? `**FULL** ${classicMapData.currentcount}` : classicMapData.currentcount}/100`, true)
      .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png');
    
    message.channel.send(queueEmbed);
    message.channel.stopTyping();
  }
}