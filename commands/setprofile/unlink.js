const { successMessage } = require('../../functions/statusMessage');

module.exports = async (message, player) => {
  player.discord = undefined;
  player.youtube = undefined;
  player.twitch = undefined;
  player.desc = undefined;
  player.twitter = undefined;

  player.save();

  message.channel.send(successMessage.setDescription('Successfully unlinked Discord to Minecraft and cleared profile info.'));
}