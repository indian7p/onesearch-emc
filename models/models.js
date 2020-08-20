const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NationSchema = new Schema({
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

const Nation = mongoose.model('Nation', NationSchema);

const NationPSchema = new Schema({
	name: String,
	link: String,
	imgLink: String,
	amenities: String,
	status: String
});

const NationP = mongoose.model('NationP', NationPSchema);

const PlayerSchema = new Schema({
	id: String,
	history: Array,
	status: String
});

const Player = mongoose.model('Player', PlayerSchema);

const PlayerPSchema = new Schema({
  name: String,
  lastLocation: String,
  lastOnline: String
});

const PlayerP = mongoose.model('playerp', PlayerPSchema);

const ResultSchema = new Schema({
	desc: String,
	keywords: String,
	link: String,
	name: String,
	themeColor: String,
	nsfw: String,
	imgLink: String,
	id: String
});

const Result = mongoose.model('Result', ResultSchema);
Result.createIndexes({ name: 'text', keywords: 'text' });

const SiegeSchema = new Schema({
  town: String,
  x: String,
  z: String,
  attacker: String
});

const Siege = mongoose.model('Siege', SiegeSchema);

const SResultSchema = new Schema({
	desc: String,
	imgLink: String,
	link: String,
	name: String,
	themeColor: String,
	sImgLink: String,
	nsfw: String,
	match: String
});

const SResult = mongoose.model('SResult', SResultSchema);
SResult.createIndexes({ name: 'text', keywords: 'text' });

const TownSchema = new Schema({
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

const Town = mongoose.model('Town', TownSchema);

const TownPSchema = new Schema({
	name: String,
	imgLink: String,
	desc: String,
	scrating: String,
	link: String
});

const TownP = mongoose.model('TownP', TownPSchema);

module.exports = {
  Nation: Nation,
  NationP: NationP,
  Town: Town,
  TownP: TownP,
  Player: Player,
  PlayerP: PlayerP,
  Result: Result,
  SResult: SResult,
  Siege: Siege,
}