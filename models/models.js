"use strict";
exports.__esModule = true;
exports.LinkCode = exports.NationGroup = exports.TownP = exports.Town = exports.Siege = exports.Result = exports.PlayerP = exports.Player = exports.NationP = exports.Nation = void 0;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var NationSchema = new Schema({
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
exports.Nation = mongoose.model('Nation', NationSchema);
var NationPSchema = new Schema({
    name: String,
    link: String,
    imgLink: String,
    amenities: String,
    status: String
});
exports.NationP = mongoose.model('NationP', NationPSchema);
var PlayerSchema = new Schema({
    id: String,
    history: Array,
    status: String
});
exports.Player = mongoose.model('Player', PlayerSchema);
var PlayerPSchema = new Schema({
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
exports.PlayerP = mongoose.model('playerp', PlayerPSchema);
var ResultSchema = new Schema({
    desc: String,
    keywords: String,
    link: String,
    name: String,
    themeColor: String,
    nsfw: String,
    imgLink: String,
    id: String
});
exports.Result = mongoose.model('Result', ResultSchema);
exports.Result.collection.createIndex({ name: 'text', keywords: 'text' });
var SiegeSchema = new Schema({
    town: String,
    x: String,
    z: String,
    attacker: String
});
exports.Siege = mongoose.model('Siege', SiegeSchema);
var TownSchema = new Schema({
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
    time: { type: Date, "default": Date.now }
});
exports.Town = mongoose.model('Town', TownSchema);
var TownPSchema = new Schema({
    name: String,
    imgLink: String,
    desc: String,
    scrating: String,
    link: String
});
exports.TownP = mongoose.model('TownP', TownPSchema);
var NationGroupSchema = new Schema({
    name: String,
    leader: String,
    size: Number,
    members: Number,
    nations: Array,
    imgLink: String,
    desc: String,
    link: String
});
exports.NationGroup = mongoose.model('NationGroup', NationGroupSchema);
exports.NationGroup.collection.createIndex({ name: 'text' });
var LinkCodeSchema = new Schema({
    code: String,
    id: String,
    createdAt: { type: Date, expires: 600, "default": Date.now }
});
exports.LinkCode = mongoose.model('LinkCode', LinkCodeSchema);
