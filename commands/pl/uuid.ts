import * as Discord from 'discord.js';
import { getPlayer } from "../../functions/fetch";
import { errorMessage } from "../../functions/statusMessage";

export default async (message, args) => {
  const data = await getPlayer(args[2]);

  if (data.success == false) return message.channel.send(errorMessage.setDescription('Invalid username or UUID'));

  const resEmbedU = new Discord.MessageEmbed()
    .setTitle(`UUID - ${data.data.player.username}`)
    .setColor(0x003175)
    .setThumbnail(`https://crafatar.com/avatars/${data.data.player.raw_id}?overlay`)
    .addField('UUID', data.data.player.raw_id)
    .addField('Formatted', data.data.player.id)
    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
  message.channel.send(resEmbedU);
}