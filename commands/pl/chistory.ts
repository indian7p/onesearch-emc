import * as Discord from 'discord.js';
import { getPlayer } from "../../functions/fetch";
import { errorMessage } from '../../functions/statusMessage';
import { Player } from '../../models/models';

export default async (message, args) => {
  const data = await getPlayer(args[2])

  if (data.success == false) return message.channel.send(errorMessage.setDescription('Invalid username or UUID'));

  const player = await Player.findOne({ id: data.data.player.raw_id }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

  if (!player || !player.history || player.history.length == 0) return message.channel.send(errorMessage.setDescription('History not found'));

  let resEmbedPl = new Discord.MessageEmbed()
    .setTitle(`Player History - ${data.data.player.username}`)
    .setThumbnail(`https://crafatar.bcow.xyz/avatars/${data.data.player.raw_id}?overlay`)
    .setDescription('⚠ Player event history started on 4/17/2020. Previous events are missing.')
    .setColor(0x003175)
    .addField('Current Status', player.status)
    .addField('Player History', '```' + player.history.toString().replace(/,/g, '\n') + '```')
    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
  message.channel.send(resEmbedPl);
}