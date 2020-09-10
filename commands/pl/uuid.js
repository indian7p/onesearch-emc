const Discord = require('discord.js');
const { getPlayer } = require("../../functions/fetch");

module.exports = async (message, args) => {
  const data = await getPlayer(args[2]);

  if (data.success == false) return message.channel.send(errorMessage.setDescription('Invalid username or UUID'));

  const resEmbedU = new Discord.MessageEmbed()
    .setTitle(`UUID - ${data.data.player.username}`)
    .setColor(0x003175)
    .setThumbnail(`https://crafatar.com/renders/body/${data.data.player.raw_id}?overlay`)
    .addField('UUID', data.data.player.raw_id)
    .addField('Formatted', data.data.player.id)
    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
  message.channel.send(resEmbedU);
}