import { errorMessage, successMessage } from '../../functions/statusMessage';
import { NationP } from '../../models/models';

export default async (message, args, nation, nationp) => {
  if (args[3] == 'null') {
    if (nationp) {
      nationp.status = null;
      nationp.save()
    }
    message.channel.send(successMessage.setDescription(`Cleared the nation's status`));
    return;
  }

  let status = message.content.slice(9 + args[1].length + args[2].length);

  if (!nationp) {
    let newDoc = new NationP({
      name: nation.nameLower,
      status: status
    })
    newDoc.save(function (err) {
      if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
      message.channel.send(successMessage.setDescription(`Set set the nation's status to ${status}`));
    })
  } else {
    nationp.status = status;
    nationp.save();

    message.channel.send(successMessage.setDescription(`Set set the nation's status to ${status}`));
  }
}