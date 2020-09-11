import { TownP, NationP } from '../../models/models';
import { errorMessage, successMessage } from '../../functions/statusMessage';

export default async (message, args, town, townp) => {
  if (args[3] == 'null') {
    if (townp) {
      townp.scrating = null;
      townp.save();
    }
    message.channel.send(successMessage.setDescription(`Cleared the town's rating.`));
  }

  let rating = message.content.slice(9 + args[2].length + args[1].length);
  if (!townp) {
    let newDoc = new TownP({
      name: town.name,
      scrating: rating
    })
    newDoc.save(function (err) {
      if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
      message.channel.send(successMessage.setDescription(`Successfully set the town's rating.`));
    })
  } else {
    townp.scrating = rating;
    townp.save();
    
    message.channel.send(successMessage.setDescription(`Successfully set the town's rating.`));
  }
}