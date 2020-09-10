const Discord = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const config = require('./config.json');
const { Nation, NationP, Town, TownP, Player, PlayerP, Result, Siege, NationGroup } = require('./models/models');
const client = new Discord.Client();

mongoose.connect(config.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
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
			client.commands.get('crawl').execute(message, Result, client);
			break;
		case 'help':
			client.commands.get('help').execute(message, client);
			break;
		case 'info':
			client.commands.get('info').execute(message, client);
			break;
		case 'link':
			client.commands.get('link').execute(message);
			break;
		case 'listaudit':
			client.commands.get('listaudit').execute(message, Nation, NationP);
			break;
		case 'listplayers':
			client.commands.get('listplayers').execute(message, Player, client);
			break;
		case 'n':
		case 'nation':
			client.commands.get('n').execute(message, args, Nation, NationP, Town, PlayerP, client);
			break;
		case 'ng':
			client.commands.get('ng').execute(message, args, NationGroup, client);
			break;
		case 'nonation':
			client.commands.get('nonation').execute(message, args, Town, Nation, client);
			break;
		case 'notown':
			client.commands.get('notown').execute(message, Town, client);
			break;
		case 'pl':
		case 'player':
			client.commands.get('pl').execute(message, args, client);
			break;
		case 'queue':
			client.commands.get('queue').execute(message, client);
			break;
		case 's':
		case 'search':
			client.commands.get('s').execute(message, args, Nation, NationGroup, NationP, Result, Town, TownP, client);
			break;
		case 'setn':
			client.commands.get('setn').execute(message, args, Nation, NationP);
			break;
		case 'setpl':
			client.commands.get('setpl').execute(message, args, Player, client);
			break;
		case 'setprofile':
			client.commands.get('setprofile').execute(message, args);
			break;
		case 'sett':
			client.commands.get('sett').execute(message, args, Town, TownP, client);
			break;
		case 'stats':
			client.commands.get('stats').execute(message, client, Town, Nation, Result);
			break;
		case 'stopTyping':
			message.channel.stopTyping();
			break;
		case 't':
		case 'town':
			client.commands.get('t').execute(message, args, Town, Nation, TownP, PlayerP, client);
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
