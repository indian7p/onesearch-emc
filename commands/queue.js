const Discord = require('discord.js');
const {embed, errorMessage} = require('../functions/statusMessage');
const {getPlayerCount, getMapData} = require('../functions/fetch');

module.exports = {
  name: "queue",
  description: 'Shows current queue info',
  execute: async (message) => {
    let server = await getPlayerCount('earthmc.net')

    let mapData = await getMapData().catch(err => {
      message.channel.send(errorMessage.setDescription('Error occurred while getting map data.'))
    });
    
    let queue = server.players.now - mapData.currentcount
    
    let queueEmbed = new Discord.MessageEmbed().setColor(0x003175).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png')
      .setTitle('Queue')
      .setThumbnail('https://cdn.bcow.tk/logos/EarthMC.png')
      .addField("In Queue", queue, true)
      .addField("Towny", `${mapData.currentcount >= 120 ? `**FULL** ${mapData.currentcount}` : mapData.currentcount}/120`, true)
    
    message.channel.send(queueEmbed)
  }
}