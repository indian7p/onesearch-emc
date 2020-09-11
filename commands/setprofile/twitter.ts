import { errorMessage, successMessage } from '../../functions/statusMessage';

export default async (message, args, player) => {
  if (args[2] == 'null') {
    player.twitter = undefined;
    player.save();

    message.channel.send(successMessage.setDescription('Successfully cleared Twitter.'));
  } else {
    if (args[2].match(/^(?:https?:\/\/)?(?:www\.)?twitter\.com\/(#!\/)?[a-zA-Z0-9_]+$/i)) {
      const twitterURL = args[2].replace('http://', 'https://');

      player.twitter = twitterURL;
      player.save();

      message.channel.send(successMessage.setDescription('Successfully set Twitter.'));
    } else {
      message.channel.send(errorMessage.setDescription('Invalid Twitter URL.'));
    }
  }
}