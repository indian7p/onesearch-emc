import { errorMessage, successMessage } from '../../functions/statusMessage';
import { Player } from '../../models/models';

export default async (message, args, player, data) => {
  if (args[3] == 'null') {
    if (player) {
      player.history = null;
      player.save();
    }

    message.channel.send(successMessage.setDescription(`Cleared the player's status.`));
    return;
  }

  if (player) {
    player.status = message.content.slice(15 + args[2].length);
  } else {
    let newDoc = new Player({
      id: data.data.player.raw_id,
      status: message.content.slice(15 + args[2].length)
    })
    newDoc.save(function (err) {
      if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
      message.channel.send(successMessage.setDescription(`Set ${args[2]}'s status to ${message.content.slice(15 + args[2].length)}.`));
    })
  }
}