import * as Discord from 'discord.js';
import { errorMessage } from '../functions/statusMessage';
import { Town, Nation, Result } from '../models/models';

export default {
  name: 'stats',
  description: 'Shows bot stats',
  execute: async (message, client) => {
    message.channel.startTyping();

    const towns = await Town.find({}).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
    const nations = await Nation.find({}).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
    const results = await Result.find({}).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

    let resCount = [];
    for (var i = 0; i < towns.length; i++) {
      const town = towns[i];

      resCount.push(town.membersArr.length);
    }

    const statsEmbed = new Discord.MessageEmbed()
      .setTitle('Stats')
      .setThumbnail('https://cdn.bcow.xyz/assets/onesearch.png')
      .setColor(0x003175)
      .addField('**Towny Stats**', '⠀', false)
      .addField('Nations', nations.length, true)
      .addField('Towns', towns.length, true)
      .addField('Residents', resCount.reduce((a,b)=>a+b), true)
      .addField('**Bot Stats**', '⠀', false)
      .addField('Servers', client.guilds.cache.size, true)
      .addField('Users', client.users.cache.size, true)
      .addField('Search Items', results.length, true)
      .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');

    message.channel.send(statsEmbed);
    message.channel.stopTyping();
  }
};
