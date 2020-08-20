const config = require('../config.json');
const {errorMessage, embed} = require('../functions/statusMessage');
const {getPlayer} = require('../functions/fetch');

module.exports = {
	name: 'listplayers',
	description: 'Lists all players in the database.',
	execute: (message, Player) => {
		if (!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));

		Player.find({}, function (err, players) {
			if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

			players.forEach(async player => {
				let data = await getPlayer(player.id);

				let playerEmbed = embed
					.setTitle(data.data.player.username.replace(/_/g, '\_'))
					.setURL(`https://namemc.com/${player.id}`)
					.setThumbnail(`https://crafatar.com/avatars/${player.id}?overlay`)
					.setDescription(player.status)
				message.channel.send(playerEmbed);
			})
		})
	}
};