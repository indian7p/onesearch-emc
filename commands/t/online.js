const Discord = require('discord.js');
const { getMapData } = require("../../functions/fetch");
const { Town } = require('../../models/models');
const { errorMessage } = require('../../functions/statusMessage');

module.exports = async (message, args) => {
  const data = await getMapData();
  const query = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');

  const town = await Town.findOne({ nameLower: query }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

  if (!town) {
    message.channel.stopTyping();
    return message.channel.send(errorMessage.setDescription('Town not found. The database may be updating, try again in a minute.'));
  }

  let online = [];
  for (var i = 0; i < data.players.length; i++) {
    const player = data.players[i];

    const playerTown = await Town.findOne({ membersArr: { $in: [player.account] } }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

    if (playerTown && playerTown.name == town.name) {
      online.push(player.account);
    }
  }

  const onlineCount = online.length == 0 ? 0 : online.length;
  if (online.length == 0) online.push('No players online');

  const embed = new Discord.MessageEmbed()
    .setTitle(`Players Online - ${town.name}`)
    .setColor(0x003175)
    .setDescription(`**Players [${onlineCount}]**\`\`\`\n${online.toString().replace(/,/g, ', ')}\`\`\``)
    .setFooter(`OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
  message.channel.send(embed);

  message.channel.stopTyping();
}