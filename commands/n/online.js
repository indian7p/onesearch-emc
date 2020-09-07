const Discord = require('discord.js')
const { Town, Nation } = require('../../models/models');
const { getMapData } = require('../../functions/fetch');
const { errorMessage } = require('../../functions/statusMessage');

module.exports = async (message, args) => {
  const onQuery = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');

  const data = await getMapData();

  const nation = await Nation.findOne({ nameLower: onQuery }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')))

  if (!nation) {
    message.channel.send(errorMessage.setDescription('Nation not found. The database may be updating, try again in a minute.'));
    message.channel.stopTyping();
    return;
  }

  let online = [];
  for (var i = 0; i < data.players.length; i++) {
    const player = data.players[i];

    const playerTown = await Town.findOne({ membersArr: { $in: [player.account] } }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

    if (playerTown && playerTown.nation == nation.name) {
      online.push(player.account);
    }
  }

  const onlineCount = online.length == 0 ? 0 : online.length;
  if (online.length == 0) online.push('No players online');

  let embed = new Discord.MessageEmbed()
    .setTitle(`Players Online - ${nation.name.replace(/_/g, '\_')}`)
    .setColor(0x003175)
    .setDescription(`**Players [${onlineCount}]**\`\`\`\n${online.toString().replace(/,/g, ', ').replace(/_/g, '\_')}\`\`\``)
    .setFooter(`OneSearch`, 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png');
  
  message.channel.send(embed);
  message.channel.stopTyping();
}