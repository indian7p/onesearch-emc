import { TownP } from '../../models/models';
import { errorMessage, successMessage } from '../../functions/statusMessage';

export default async (message, args, town, townp) => {
  if (args[3] == 'null') {
    if (townp) {
      townp.imgLink = null;
      townp.save();
    }
    message.channel.send(successMessage.setDescription(`Cleared the town's image.`));
  }

  let imgLink = message.content.slice(9 + args[1].length + args[2].length).replace(/^(http|https):\/\//, 'https://cdn.statically.io/img/');
  if (!townp) {
    let newDoc = new TownP({
      name: town.name,
      imgLink: imgLink
    })
    newDoc.save(function (err) {
      if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
      message.channel.send(successMessage.setDescription(`Successfully set the town's image.`));
    })
  } else {
    townp.imgLink = imgLink;
    townp.save();

    message.channel.send(successMessage.setDescription(`Successfully set the town's image.`));
  }
}