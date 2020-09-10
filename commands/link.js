const Discord = require('discord.js');
const config = require('../config.json');
const { errorMessage } = require('../functions/statusMessage');
const { LinkCode } = require('../models/models');

module.exports = {
  name: 'link',
  description: 'Generates a link code for Discord and Minecraft link.',
  execute: async (message) => {
    let code = Math.floor(100000 + Math.random() * 900000);

    const codeDoc = await LinkCode.findOne({ code: code }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
    if (codeDoc) code = Math.floor(100000 + Math.random() * 900000);

    const document = new LinkCode({
      code: code,
      id: message.author.id,
    })
    document.save();

    if (message.channel.type !== 'dm') {
      const embed1 = new Discord.MessageEmbed()
        .setTitle('Link To Minecraft')
        .setColor(0x003175)
        .setDescription('We sent a message to your DMs with instructions.')
        .setFooter(`OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');

      message.channel.send(embed1)
    }

    const embed2 = new Discord.MessageEmbed()
      .setTitle('Link To Minecraft')
      .setColor(0x003175)
      .addField('Step 1 - Connect to server', 'Connect to \`verify.bcow.xyz\`, version 1.8.8-1.16.2')
      .addField('Step 2 - Link account', `Do not share your code with anyone else, the code expires in 10 minutes. Use the command \`/link ${code}\` on the Minecraft server.`)
      .addField('Step 3 - Done!', 'You should receive a message if it was successful.')
      .setFooter(`OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');

    message.author.send(embed2)
  }
};