import * as Discord from 'discord.js';
import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as config from './config.json';
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
			commands['crawl'].execute(message);
			break;
		case 'help':
			commands['help'].execute(message, args);
			break;
		case 'info':
			commands['info'].execute(message);
			break;
		case 'link':
			commands['link'].execute(message);
			break;
		case 'listaudit':
			commands['listaudit'].execute(message);
			break;
		case 'n':
		case 'nation':
			commands['n'].execute(message, args);
			break;
		case 'ng':
			commands['ng'].execute(message, args);
			break;
		case 'nationless':
		case 'nonation':
			commands['nonation'].execute(message, args);
			break;
		case 'townless':
		case 'notown':
			commands['notown'].execute(message);
			break;
		case 'pl':
		case 'player':
			commands['pl'].execute(message, args, client);
			break;
		case 'queue':
			commands['queue'].execute(message);
			break;
		case 's':
		case 'search':
			commands['s'].execute(message, args);
			break;
		case 'setn':
			commands['setn'].execute(message, args);
			break;
		case 'setpl':
			commands['setpl'].execute(message, args);
			break;
		case 'setprofile':
			commands['setprofile'].execute(message, args);
			break;
		case 'sett':
			commands['sett'].execute(message, args);
			break;
		case 'stats':
			commands['stats'].execute(message, client);
			break;
		case 'stopTyping':
			message.channel.stopTyping();
			break;
		case 't':
		case 'town':
			commands['t'].execute(message, args);
			break;
	}
});
