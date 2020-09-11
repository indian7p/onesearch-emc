import * as Discord from 'discord.js';
import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as config from './config.json';
import { Nation, NationP, Town, TownP, Player, PlayerP, Result, Siege, NationGroup } from './models/models';
const client = new Discord.Client();

mongoose.connect(config.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

let commands = {};
const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js') || file.endsWith('.ts'));
for (const file of commandFiles) {
	const command = require(`./commands/${file.replace(/\.ts|\.js/, '')}`);

	commands[command.default.name] = command.default;
}

client.login(config.TOKEN);

const PREFIX = '1!';

client.on('ready', () => {
	let statuses = ['Search towns, nations, discords and players fast. 1!s [nation/town/anything] or 1!pl [username or UUID]', 'Statuspage: bcow.statuspage.io', 'Invite me! l.bcow.tk/osbot', 'github.com/imabritishcow/onesearch-emc'];
	setInterval(function () {
		let status = statuses[Math.floor(Math.random() * statuses.length)];
		client.user.setActivity(status);
	}, 60000);

	console.log('Bot is online.');
});

client.on('message', (message) => {
	const args = message.content.substring(PREFIX.length).split(' ');
	if (!message.content.includes(PREFIX)) return;
	if (message.content.startsWith(PREFIX) == false) return;

	switch (args[0]) {
		case 'crawl':
			commands['crawl'].execute(message, Result, client);
			break;
		case 'help':
			commands['help'].execute(message, client);
			break;
		case 'info':
			commands['info'].execute(message, client);
			break;
		case 'link':
			commands['link'].execute(message);
			break;
		case 'listaudit':
			commands['listaudit'].execute(message, Nation, NationP);
			break;
		case 'n':
		case 'nation':
			commands['n'].execute(message, args, Nation, NationP, Town, PlayerP, client);
			break;
		case 'ng':
			commands['ng'].execute(message, args, NationGroup, client);
			break;
		case 'nonation':
			commands['nonation'].execute(message, args, Town, Nation, client);
			break;
		case 'notown':
			commands['notown'].execute(message, Town, client);
			break;
		case 'pl':
		case 'player':
			commands['pl'].execute(message, args, client);
			break;
		case 'queue':
			commands['queue'].execute(message, client);
			break;
		case 's':
		case 'search':
			commands['s'].execute(message, args, Nation, NationGroup, NationP, Result, Town, TownP, client);
			break;
		case 'setn':
			commands['setn'].execute(message, args, Nation, NationP);
			break;
		case 'setpl':
			commands['setpl'].execute(message, args, Player, client);
			break;
		case 'setprofile':
			commands['setprofile'].execute(message, args);
			break;
		case 'sett':
			commands['sett'].execute(message, args, Town, TownP, client);
			break;
		case 'stats':
			commands['stats'].execute(message, client);
			break;
		case 'stopTyping':
			message.channel.stopTyping();
			break;
		case 't':
		case 'town':
			commands['t'].execute(message, args, Town, Nation, TownP, PlayerP, client);
			break;
		// For converting Player to PlayerP
		/*case 'merge':
			Player.find({}, function (err, players) {
				for (var i = 0; i < players.length; i++) {
					const player = players[i];

					PlayerP.findOne({uuid: player.id}, function(err, playerp) {
						if (playerp) {
							playerp.history = player.history;
							playerp.status = player.status;
							playerp.save();
						} else {
							const doc = new PlayerP({
								uuid: player.id,
								lastLocation: 'none',
								lastOnline: 'No data.',
								history: player.history,
								status: player.status
							})

							doc.save();
						}
					})
				}
			})
			break;*/
	}
});
