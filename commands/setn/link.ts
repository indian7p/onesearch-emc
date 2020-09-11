import { errorMessage, successMessage } from '../../functions/statusMessage';
import { NationP } from '../../models/models';
import checkURL from '../../functions/checkURL';

export default async (message, args, nation, nationp) => {
  if (args[3].includes('null')) {
    if (nationp) {
      nationp.link = null;
      nationp.save()
    }
    message.channel.send(successMessage.setDescription(`Cleared the nation's discord.`));
    return;
  }
  
  let link = message.content.slice(9 + args[1].length + args[2].length);

  if (checkURL(link) == false) return message.channel.send(errorMessage.setDescription('Invalid URL'));
  
  if (!nationp) {
    let newDoc = new NationP({
      name: nation.nameLower,
      link: link
    })
    newDoc.save(function (err) {
      if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
      message.channel.send(successMessage.setDescription(`Set set the nation's discord to ${link}`));
    })
  } else {
    nationp.link = link;
    nationp.save();

    message.channel.send(successMessage.setDescription(`Set set the nation's discord to ${link}`));
  }
}