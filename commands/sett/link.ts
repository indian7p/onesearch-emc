import { TownP } from '../../models/models';
import { errorMessage, successMessage } from '../../functions/statusMessage';

export default async (message, args, town, townp) => {
  if (args[3] == 'null') {
    if (townp) {
      townp.link = null;
      townp.save();
    }
    message.channel.send(successMessage.setDescription(`Cleared the town's link.`));
  }
  
  let link = message.content.slice(9 + args[2].length + args[1].length);
  if (!townp) {
    let newDoc = new TownP({
      name: town.name,
      link: link
    })
    newDoc.save(function (err) {
      if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
      message.channel.send(successMessage.setDescription(`Successfully set the town's link.`));
    })
  } else {
    townp.link = link;
    townp.save();
    
    message.channel.send(successMessage.setDescription(`Successfully set the town's link.`));
  }
}