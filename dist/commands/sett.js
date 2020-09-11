"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const config = require("../config.json");
const models_1 = require("../models/models");
const statusMessage_1 = require("../functions/statusMessage");
const img_1 = require("./sett/img");
const rating_1 = require("./sett/rating");
const link_1 = require("./sett/link");
exports.default = {
    name: 'sett',
    description: 'Sets town information',
    execute: (message, args) => __awaiter(void 0, void 0, void 0, function* () {
        let helpEmbed = new Discord.MessageEmbed()
            .setTitle('1!sett')
            .setDescription('Using `null` as the value will clear that type.')
            .setColor(0x003175)
            .addField('1!sett img', 'Sets a towns image')
            .addField('1!sett rating', 'Sets a towns Shootcity rating')
            .addField('1!sett link', 'Sets a towns link')
            .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
        if (!config.BOT_ADMINS.includes(message.author.id))
            return message.channel.send(statusMessage_1.errorMessage.setDescription('You do not have permission to use this command.'));
        if (!args[2])
            return message.channel.send(helpEmbed);
        let query = args[2].toLowerCase();
        const town = yield models_1.Town.findOne({ nameLower: query }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error message.')));
        if (!town)
            return message.channel.send(statusMessage_1.errorMessage.setDescription('Town not found.'));
        const townp = yield models_1.TownP.findOne({ name: town.name }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error message.')));
        switch (args[1]) {
            case 'img':
                img_1.default(message, args, town, townp);
                break;
            case 'rating':
                rating_1.default(message, args, town, townp);
                break;
            case 'link':
                link_1.default(message, args, town, townp);
                break;
            default:
                message.channel.send(helpEmbed);
                break;
        }
    })
};
//# sourceMappingURL=sett.js.map