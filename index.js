const Discord = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const config = require('./config.json');

const client = new Discord.Client();

mongoose.connect(config.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

let TownSchema = new Schema({
	name: String,
	nameLower: String,
	nation: String,
	color: String,
	area: Number,
	mayor: String,
	members: String,
	membersArr: Array,
	residents: Number,
	x: String,
	z: String,
	capital: Boolean,
	time: { type: Date, default: Date.now }
});
let NationSchema = new Schema({
	name: String,
	nameLower: String,
	color: String,
	towns: String,
	townsArr: Array,
	area: Number,
	residents: Number,
	owner: String,
	capital: String,
	location: String
});
let ResultSchema = new Schema({
	desc: String,
	keywords: String,
	link: String,
  name: String,
	themeColor: String,
	nsfw: String,
	imgLink: String,
	id: String
});
let SResultSchema = new Schema({
	desc: String,
	imgLink: String,
	link: String,
	name: String,
	themeColor: String,
	sImgLink: String,
	nsfw: String,
	match: String
});
let ImageSchema = new Schema({
  desc: String,
  meta: String,
  link: String,
  rlink: String,
  nsfw: String
})

var Town = mongoose.model('Town', TownSchema);
var Nation = mongoose.model('Nation', NationSchema);
var Result = mongoose.model('Result', ResultSchema);
Result.collection.ensureIndex({ name: 'text', keywords: 'text' });
var SResult = mongoose.model('SResult', SResultSchema);
SResult.collection.ensureIndex({ match: 'text' });
var Image = mongoose.model('Image', ImageSchema);
Image.collection.ensureIndex({ desc: 'text', meta: 'text'})

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

client.login(config.TOKEN);

const PREFIX = '1!';

client.on('ready', () => {
	let statuses = [ 'Search towns, nations, discords and players fast. 1!s [nation/town/anything] or 1!pl [username or UUID]', 'Statuspage: bcow.statuspage.io', 'Invite me! l.bcow.tk/osbot', 'github.com/imabritishcow/onesearch-emc' ];
	setInterval(function() {
		let status = statuses[Math.floor(Math.random() * statuses.length)];
		client.user.setActivity(status);
	}, 60000);

	console.log('heyyyy');
});

client.on('message', (message) => {
  let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
	let args = message.content.substring(PREFIX.length).split(' ');
	if (!message.content.includes(PREFIX)) return;
	if (message.content.startsWith(PREFIX) == false) return;

	switch (args[0]) {
		case 'calculator':
			client.commands.get('calculator').execute(message, args);
			break;
		case 'coinflip':
			client.commands.get('coinflip').execute(message);
			break;
		case 'getall':
			client.commands.get('getall').execute(message, Result);
			break;
		case 'help':
			client.commands.get('help').execute(message);
			break;
		case 'info':
			client.commands.get('info').execute(message);
			break;
		case 'listaudit':
			client.commands.get('listaudit').execute(message, Nation);
			break;
		case 'listscammers':
			client.commands.get('listscammers').execute(message, Nation);
			break;
		case 's':
			client.commands.get('s').execute(message, args, Nation, Result, Town, SResult);
			break;
		case 't':
		case 'town':
			client.commands.get('t').execute(message, args, Town);
			break;
		case 'pl':
		case 'player':
			client.commands.get('pl').execute(message, args, Town, client);
			break;
		case 'n':
		case 'nation':
			client.commands.get('n').execute(message, args, Town, Nation);
			break;
		case 'nonation':
			client.commands.get('nonation').execute(message, Nation);
			break;
		case 'notown':
			client.commands.get('notown').execute(message, Town);
			break;
		case 'randomnumber':
			client.commands.get('randomnumber').execute(message, args);
			break;
		case 'readify':
			client.commands.get('readify').execute(message);
			break;
		case 'setn':
			client.commands.get('setn').execute(message, args, Nation);
			break;
		case 'setpl':
			client.commands.get('setpl').execute(message, args, Town, Nation, client);
			break;
		case 'sett':
			client.commands.get('sett').execute(message, args, Town);
			break;
		case 'stats':
			client.commands.get('stats').execute(message, client, Town, Nation, Result);
			break;
		case 'stopTyping':
			message.channel.stopTyping();
      break;
    case 'si':
      client.commands.get('si').execute(message, args, Image);
      break;
		case 'updatelistcache':
			message.delete();
			client.commands.get('updatelistcache').execute(Town, Nation);
			break;
    case 'leavechannel':
      try {
        message.member.voice.channel.leave()
      }catch(e){
        message.channel.send(errorMessage.setDescription("An error occurred."))
      }
      break;
    case 'crawl':
      client.commands.get('crawl').execute(message, Result);
      break;
	}
});
