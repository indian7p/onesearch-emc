

import { errorMessage, successMessage } from '../../functions/statusMessage';
import { NationP } from '../../models/models';

export default async (message, args, nation, nationp) => {
  let sliced = message.content.slice(9 + args[1].length + args[2].length);
  if (args[3] == 'null') {
    if (nationp) {
      nationp.link = null;
      nationp.save()
    }
    message.channel.send(successMessage.setDescription(`Cleared the nation's image.`));
    return;
  }

  let imgLink;
  if (sliced.indexOf('wikia') > 0) {
    var linkCDN1 = sliced.replace(/\/revision.*$/gimu, '');
    imgLink = linkCDN1.replace('https://', 'https://cdn.statically.io/img/');
  } else {
    if (sliced.indexOf('cdn.bcow.tk') > 0 || sliced.indexOf('cdn.bcow.xyz') > 0) {
      imgLink = sliced;
    } else {
      imgLink = sliced.replace('https://', 'https://cdn.statically.io/img/');
    }
  }

  if (!nationp) {
    let newDoc = new NationP({
      name: nation.nameLower,
      imgLink: imgLink
    })
    newDoc.save(function (err) {
      if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
      message.channel.send(successMessage.setDescription(`Sucessfully set the nation's image`));
    })
  } else {
    nationp.imgLink = imgLink;
    nationp.save();

    message.channel.send(successMessage.setDescription(`Sucessfully set the nation's image`));
  }
}