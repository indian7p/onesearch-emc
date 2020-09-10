const { successMessage } = require('../../functions/statusMessage');

module.exports = async (message, args, player) => {
  if (args[2] == 'null') {
    player.desc = undefined;
    player.save();

    message.channel.send(successMessage.setDescription('Successfully cleared profile description.'));
  } else {
    const desc = message.content.slice(args[0].length + args[1].length + 4);

    player.desc = desc;
    player.save();

    message.channel.send(successMessage.setDescription('Successfully set profile description.'));
  }
}