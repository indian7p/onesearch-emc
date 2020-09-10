const Discord = require('discord.js');
const { getPlayer } = require("../../functions/fetch");
const { errorMessage } = require('../../functions/statusMessage');
const { PlayerP } = require('../../models/models');

module.exports = async (message, args) => {
  const data = getPlayer(args[2]);

  if (data.success == false) return message.channel.send(errorMessage.setDescription('Invalid username/UUID.'));

  const player = PlayerP.findOne({ uuid: data.data.player.raw_id }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

  if (!player) return message.channel.send(errorMessage.setDescription('No player activity data.'));

  const location = player.lastLocation.replace(/ /, '').split(',');

  const locationString = location == "none" ? `Last location could not be found.` : `[${player.lastLocation}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${location[0]}&y=64&z=${location[1]})`

  const resEmbed = new Discord.MessageEmbed()
    .setTitle(`${data.data.player.username} - Player Activity`)
    .setColor(0x003175)
    .setThumbnail(data.data.player.avatar)
    .addField('Last Online', player.lastOnline)
    .addField('Last Location', locationString)
    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');

  message.channel.send(resEmbed);
}