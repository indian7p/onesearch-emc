const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const http = require('http');
const express = require('express');
const cache = require('quick.db');
const nationsP = new cache.table('nationsP');
const townP = new cache.table('townP');
const casst = new cache.table('casst');
const players = new cache.table('players');
const tmp = new cache.table('tmp');
const fetch = require('node-fetch');
const fn = require('/app/util/fn')
const moment = require('moment-timezone')
const listcache = new cache.table('listcache')
const stats = new cache.table('stats')

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

let TownSchema = new Schema({
	name: String,
	nameLower: String,
	nation: String,
	color: String,
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
  residents: Number,
  owner: String,
  capital: String,
  location: String
});
let ResultSchema = new Schema({
  desc: String,
  imgLink: String,
  link: String,
  name: String,
  themeColor: String,
  nsfw: String,
  id: String
})
let TownPSchema = new Schema({
  name: String,
  scrating: String,
  imgLink: String,
  link: String
})
let StatsSchema = new Schema({
  name: String,
  count: String
});

var Town = mongoose.model('Town', TownSchema);
var TownP1 = mongoose.model('TownP', TownPSchema);
var Nation = mongoose.model('Nation', NationSchema);
var Result = mongoose.model('Result', ResultSchema);

var admin = require('firebase-admin');

var serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: ''
});

const db = admin.firestore();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

client.login(process.env.TOKEN);

const PREFIX = '1!';

client.on('ready', () => {
	console.log('heyyyy');
	setInterval(function() {
		client.user.setActivity('Updating database...');
		setTimeout(function() {
			client.user.setActivity('Search towns, nations, discords and players fast. 1!st [town name] or 1!pl [username or UUID] or 1!s [nation/anything]');
		}, 120000);
	}, 3600000 + 1800000);
});

client.on('message', (message) => {
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
			client.commands.get('help').execute(message, args);
			break;
    case 'info':
      client.commands.get('info').execute(message);
      break;
    case 'listaudit':
			client.commands.get('listaudit').execute(message, args, Nation);
      break;
    case 'listscammers':
      client.commands.get('listscammers').execute(message, args, Nation);
      break;
		case 'updatecache':
			client.commands.get('updatecache').execute(message, args);
			break;
		case 's':
			client.commands.get('s').execute(message, args, Nation, Result, Town);
			break;
		case 't':
    case 'town':
			client.commands.get('t').execute(message, args, Town);
			break;
		case 'pl':
    case 'player':
			client.commands.get('pl').execute(message, args, Town, Nation, client);
			break;
		case 'n':
    case 'nation':
			client.commands.get('n').execute(message, args, Town, Nation);
      break;
    case 'nonation':
      client.commands.get('nonation').execute(message, args, Town, Nation);
      break;
    case 'notown':
      client.commands.get('notown').execute(message, args, Town);
      break;
    case 'randomnumber':
      client.commands.get('randomnumber').execute(message, args);
      break;
		case 'readify':
			client.commands.get('readify').execute(message, args, Nation);
      break;
		case 'setn':
			client.commands.get('setn').execute(message, args, Nation);
			break;
		case 'setpl':
			client.commands.get('setpl').execute(message, args, Town, Nation, client);
			break;
		case 'sett':
			client.commands.get('sett').execute(message, args, Town, Nation);
      break;
    case 'stopTyping':
      message.channel.stopTyping()
      break;
    //On separate bot
    /*case 'updatedb':
      if(message.author.id != '456965312886079533')return message.channel.send('You do not have permission to use this command.')
      client.commands.get("updatedb").execute(Town, Nation);
      break;
    case 'updatenations':
      if(message.author.id != '456965312886079533')return message.channel.send('You do not have permission to use this command.')
      client.commands.get("updatenations").execute(Town, Nation);
      break;*/
    case 'updatelistcache':
      client.commands.get('updatelistcache').execute(Town, Nation);
      break;
	}
});
