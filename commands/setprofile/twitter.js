const { errorMessage, successMessage } = require('../../functions/statusMessage');

module.exports = async (message, args, player) => {
  if (args[2] == 'null') {
    player.twitter = undefined;
    player.save();

    message.channel.send(successMessage.setDescription('Successfully cleared Twitter.'));
  } else {
    const twitterRegex = new RegExp('/(?:(http|https):\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/');

    if (twitterRegex.test(args[2])) {
      const twitterURL = args[2].replace('http://', 'https://');

      player.twitter = twitterURL;
      player.save();

      message.channel.send(successMessage.setDescription('Successfully set Twitter.'));
    } else {
      message.channel.send(errorMessage.setDescription('Invalid Twitter URL.'));
    }
  }
}