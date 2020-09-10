const { errorMessage, successMessage } = require('../../functions/statusMessage');

module.exports = async (message, args, player) => {
  if (args[2] == 'null') {
    player.youtube = undefined;
    player.save();

    message.channel.send(successMessage.setDescription('Successfully cleared YouTube channel.'));
  } else {
    const youtubeRegex = new RegExp('(?:https|http)\:\/\/(?:[\w]+\.)?youtube\.com\/(?:c\/|channel\/|user\/)?([a-zA-Z0-9\-]{1,})');

    if (youtubeRegex.test(args[2])) {
      const youtubeURL = args[2].replace('http://', 'https://');

      player.youtube = youtubeURL;
      player.save();

      message.channel.send(successMessage.setDescription('Successfully set YouTube channel.'));
    } else {
      message.channel.send(errorMessage.setDescription('Invalid YouTube channel URL.'));
    }
  }
}