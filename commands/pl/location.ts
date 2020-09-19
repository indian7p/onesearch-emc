import * as Discord from 'discord.js';
import { getMapData, getPlayer } from "../../functions/fetch";
import { errorMessage } from "../../functions/statusMessage";

export default async (message, args) => {
  const mapData = await getMapData().catch(err => message.channel.send(errorMessage.setDescription('Error getting map data.')));;
  const playerData = await getPlayer(args[2]);

  if (playerData.success == false) return message.channel.send(errorMessage.setDescription('Invalid username/UUID.'));

  let playerList = [];

  let location = 'Unable to get the players location. Make sure they are not under a block, invisible, or underwater.';
  for (var i = 0; i < mapData.players.length; i++) {
    const player = mapData.players[i];

    playerList.push(player.account);

    if (player.account == playerData.data.player.username) {
      if (player.world != 'earth') return;
      location = `[${player.x}, ${player.z}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${player.x}&y=64&z=${player.z})`;
    }
  }

  if (!playerList.includes(playerData.data.player.username)) return message.channel.send(errorMessage.setDescription('Player is not online.'))

  const embed = new Discord.MessageEmbed()
    .setTitle(playerData.data.player.username)
    .setThumbnail(`https://crafatar.bcow.xyz/avatars/${playerData.data.player.raw_id}?overlay`)
    .addField('Location', location)
    .setColor(0x003175)
    .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');

  message.channel.send(embed);
}