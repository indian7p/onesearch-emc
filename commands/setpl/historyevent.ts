import { errorMessage, successMessage } from '../../functions/statusMessage';
import * as moment from 'moment-timezone';

export default async (message, args, player, data) => {
  const date = moment().tz('America/New_York').format('MMMM D YYYY h:mm A z');

  if (args[3] == 'null') {
    if (player) {
      player.history = null;
      player.save();
    }
  
    message.channel.send(successMessage.setDescription(`Cleared the player's history.`));
    return;
  }
  
  if (player) {
    let old = player.history;
    let newElement = [`${date} - ${player.status} - ${message.content.slice(10 + args[1].length + args[2].length)}`];
  
    player.history = [...old, ...newElement];
  
    player.save(function (err) {
      if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
      message.channel.send(successMessage.setDescription(`Added a history event for ${data.data.player.username}.`));
    })
  } else {
    message.channel.send(errorMessage.setDescription('Set a status before adding a history event.'))
  }
}