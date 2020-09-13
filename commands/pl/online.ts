import * as Discord from 'discord.js';
import { getMapData, getPlayer } from "../../functions/fetch";
import { errorMessage } from "../../functions/statusMessage";
import * as staffList from '../../staffList.json';

export default async (message, args) => {
  message.channel.startTyping();
  const data = await getMapData();

  let playersOnline = data.players.map(player => player.account);

  switch (args[2]) {
    case 'staff':
      let playerList = playersOnline.filter((player) => {
        return staffList.staffList.includes(player);
      });

      let listLength = playerList.length;
      if (playerList.length == 0) {
        playerList.push('No staff found. Try again later.');
        listLength = 0;
      }

      let embed = new Discord.MessageEmbed()
        .setTitle('Players Online - Staff')
        .setColor(0x003175)
        .setDescription(`**Players [${listLength}]**\`\`\`${playerList.toString().replace(/,/g, ', ')}\`\`\``)
        .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
      message.channel.send(embed);
      message.channel.stopTyping();
      break;
    default:
      if (!args[2]) {
        let embed = new Discord.MessageEmbed()
          .setTitle('Players Online')
          .setColor(0x003175)
          .setDescription(`**Players [${playersOnline.length}]**\`\`\`${playersOnline.toString().replace(/,/g, ', ')}\`\`\``)
          .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
        message.channel.send(embed);
      } else {
        const playerData = await getPlayer(args[2]);

        if (playerData.success == false) return message.channel.send(errorMessage.setDescription('Invalid username/UUID.'));

        let status = 'Offline';
        if (playersOnline.includes(playerData.data.player.username)) {
          status = 'Online';
        }

        let embed = new Discord.MessageEmbed()
          .setTitle(playerData.data.player.username).setColor(0x003175)
          .addField('Status', status)
          .setThumbnail(`https://crafatar.com/avatars/${playerData.data.player.raw_id}?overlay`)
          .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
        message.channel.send(embed);
      }
      message.channel.stopTyping();
      break;
  }
}