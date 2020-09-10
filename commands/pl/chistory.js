const Discord = require('discord.js');
const { getPlayer } = require("../../functions/fetch");
const { errorMessage } = require('../../functions/statusMessage');
const { Player } = require('../../models/models');

module.exports = async (message, args) => {
  const data = await getPlayer(args[2])

  if (data.success == false) return message.channel.send(errorMessage.setDescription('Invalid username or UUID'));

  const player = await Player.findOne({ id: data.data.player.raw_id }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

  if (!player || !player.history || player.history.length == 0) return message.channel.send(errorMessage.setDescription('History not found'));

  let resEmbedPl = new Discord.MessageEmbed()
    .setTitle(`Player History - ${data.data.player.username}`)
    .setDescription('⚠ Player event history started on 4/17/2020. Previous events are missing.')
    .setColor(0x003175)
    .addField('Current Status', player.status)
    .addField('Player History', '```' + player.history.toString().replace(/,/g, '\n') + '```')
    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
  message.channel.send(resEmbedPl);
}