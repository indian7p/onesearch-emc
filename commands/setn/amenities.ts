import { errorMessage, successMessage } from '../../functions/statusMessage';
import { NationP } from '../../models/models';

export default async (message, args, nation, nationp) => {
  let AMNTString = message.content.slice(9 + args[1].length + args[2].length).replace(':NehterPortal:', '<a:NetherPortal:696081909167423567>');
  if (args[3] == 'null') {
    if (nationp) {
      nationp.amenities = null;
      nationp.save()
    }
    message.channel.send(successMessage.setDescription(`Cleared the nation's amenities`));
    return;
  }

  if (!nationp) {
    let newDoc = new NationP({
      name: nation.nameLower,
      amenities: AMNTString
    })
    newDoc.save(function (err) {
      if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
      message.channel.send(successMessage.setDescription(`Set set the nation's amenities to ${AMNTString}`));
    })
  } else {
    nationp.amenities = AMNTString;
    nationp.save();

    message.channel.send(successMessage.setDescription(`Set set the nation's amenities to ${AMNTString}`));
  }
}