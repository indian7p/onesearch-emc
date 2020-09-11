import * as Discord from 'discord.js';
import * as moment from 'moment-timezone';
import { getPlayer } from "../../functions/fetch";
import { errorMessage } from "../../functions/statusMessage";

export default async (message, args) => {
  const data = await getPlayer(args[2]);

  if (data.success == false) return message.channel.send(errorMessage.setDescription('Invalid username or UUID'));

  let dates = [];
  let names = [];
  let namesD = [];
  for (var i = 0; i < data.data.player.meta.name_history.length; i++) {
    const name1 = data.data.player.meta.name_history[i];

    dates.push(moment(name1.changedToAt / 1000, 'X').tz('America/New_York').format('MM/DD/YYYY h:mm A z'));
    names.push(name1.name);
  }

  for (var i = 0; i < names.length; i++) {
    const name2 = names[i];

    if (i == 0) {
      namesD.push(name2);
    } else {
      let date = dates[i];
      namesD.push(`${date} - ${name2}`);
    }
  }

  const resEmbedN = new Discord.MessageEmbed()
    .setTitle(`Name History - ${data.data.player.username}`)
    .setColor(0x003175)
    .setThumbnail(`https://crafatar.com/avatars/${data.data.player.raw_id}?overlay`)
    .setDescription('```' + `test\n` + namesD.toString().replace(/,/g, '\n') + '```')
    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
  message.channel.send(resEmbedN);
}