import * as mongoose from 'mongoose';
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

export const Nation = mongoose.model('Nation', NationSchema);

const NationPSchema = new Schema({
	name: String,
	link: String,
	imgLink: String,
	amenities: String,
	status: String
});

export const NationP = mongoose.model('NationP', NationPSchema);

const PlayerSchema = new Schema({
	id: String,
	history: Array,
	status: String
});

export const Player = mongoose.model('Player', PlayerSchema);

const PlayerPSchema = new Schema({
	uuid: String,
	desc: String,
	discord: String,
	youtube: String,
	twitch: String,
	twitter: String,
  lastLocation: String,
	lastOnline: String,
	history: Array,
	status: String
});

export const PlayerP = mongoose.model('playerp', PlayerPSchema);

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

export const Result = mongoose.model('Result', ResultSchema);
Result.collection.createIndex({ name: 'text', keywords: 'text' });

const SiegeSchema = new Schema({
  town: String,
  x: String,
  z: String,
  attacker: String
});

export const Siege = mongoose.model('Siege', SiegeSchema);

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

export const Town = mongoose.model('Town', TownSchema);

const TownPSchema = new Schema({
	name: String,
	imgLink: String,
	desc: String,
	scrating: String,
	link: String
});

export const TownP = mongoose.model('TownP', TownPSchema);

const NationGroupSchema = new Schema({
	name: String,
	leader: String,
	size: Number,
	members: Number,
	nations: Array,
	imgLink: String,
	desc: String,
	link: String
})

export const NationGroup = mongoose.model('NationGroup', NationGroupSchema)
NationGroup.collection.createIndex({ name: 'text' });

const LinkCodeSchema = new Schema({
	code: String,
	id: String,
	createdAt: { type: Date, expires: 600, default: Date.now }
})

export const LinkCode = mongoose.model('LinkCode', LinkCodeSchema);