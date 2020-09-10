const { errorMessage, successMessage } = require('../../functions/statusMessage');

module.exports = async (message, args, player) => {
  if (args[2] == 'null') {
    player.twitch = undefined;
    player.save();

    message.channel.send(successMessage.setDescription('Successfully cleared Twitch.'));
  } else {
    const twitchRegex = new RegExp('/(?:(http|https):\/\/)?(?:www\.)?twitch\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/');

    if (twitchRegex.test(args[2])) {
      const twitchURL = args[2].replace('http://', 'https://');

      player.twitch = twitchURL;
      player.save();

      message.channel.send(successMessage.setDescription('Successfully set Twitch.'));
    } else {
      message.channel.send(errorMessage.setDescription('Invalid Twitch URL.'));
    }
  }
}