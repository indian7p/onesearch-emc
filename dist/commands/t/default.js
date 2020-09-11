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
const moment = require("moment-timezone");
const models_1 = require("../../models/models");
const statusMessage_1 = require("../../functions/statusMessage");
exports.default = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const query = args[0] == 'town' ? message.content.slice(7).toLowerCase().replace(/ /g, '_') : message.content.slice(4).toLowerCase().replace(/ /g, '_');
    const town = yield models_1.Town.findOne({ nameLower: query }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
    if (!town)
        return statusMessage_1.errorMessage.setDescription('Town not found. The database may be updating, try again later.');
    const townp = yield models_1.TownP.findOne({ name: town.name }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
    const description = !townp ? 'Information may be slightly out of date.' : townp.scrating == null ? 'Information may be slightly out of date.' : `**[Shootcity Rating: ${townp.scrating}]** Information may be slightly out of date.`;
    const imgLink = !townp ? 'https://cdn.bcow.xyz/assets/onesearch.png' : townp.imgLink == null ? 'https://cdn.bcow.xyz/assets/onesearch.png' : townp.imgLink;
    const link = !townp ? null : townp.link;
    const townNation = yield models_1.Nation.findOne({ name: town.nation }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
    let townNationBonus;
    if (townNation) {
        const val = townNation.residents;
        switch (true) {
            case (val > 0 && val < 9):
                townNationBonus = 10;
                break;
            case (val > 10 && val < 19):
                townNationBonus = 20;
                break;
            case (val > 20 && val < 29):
                townNationBonus = 40;
                break;
            case (val > 30 && val < 39):
                townNationBonus = 60;
                break;
            case (val > 40 && val < 49):
                townNationBonus = 100;
                break;
            case (val > 50):
                townNationBonus = 140;
                break;
        }
    }
    else {
        townNationBonus = 0;
    }
    const tName = town.capital == true ? `:star: ${town.name} (${town.nation})` : `${town.name} (${town.nation})`;
    const color = town.nation == 'No Nation' ? 0x69a841 : town.color == '#000000' ? 0x010101 : town.color == '#FFFFFF' ? 0xfefefe : town.color;
    const timeUp = moment(town.time).tz('America/New_York').format('MMMM D, YYYY h:mm A z');
    const memberList = `\`\`\`${town.members}\`\`\``;
    const maxSize = town.membersArr.length * 8 > 800 ? 800 + townNationBonus : town.membersArr.length * 8 + townNationBonus;
    const resEmbed = new Discord.MessageEmbed()
        .setTitle(tName.replace(/_/g, '\_'))
        .setDescription(description)
        .setColor(color)
        .setThumbnail(imgLink)
        .addField('Owner', `\`\`\`${town.mayor}\`\`\``, true)
        .addField('Location', `[${town.x}, ${town.z}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${town.x}&y=64&z=${town.z})`, true)
        .addField('Size', `${town.area}/${maxSize} [NationBonus: ${townNationBonus}]`, true)
        .setFooter(`OneSearch | Last updated: ${timeUp}`, 'https://cdn.bcow.xyz/assets/onesearch.png');
    if (memberList.length > 1024) {
        let members1 = town.membersArr.slice(1, 50);
        let members2 = town.membersArr.slice(50, 100);
        members1 = `\`\`\`${members1.toString().replace(/,/g, ', ')}\`\`\``;
        members2 = `\`\`\`${members2.toString().replace(/,/g, ', ')}\`\`\``;
        if (!link) {
            return resEmbed.addField(`Members [1-50]`, members1).addField(`Members [51-${town.membersArr.length}]`, members2);
        }
        else {
            return resEmbed.addField(`Members [1-50]`, members1).addField(`Members [51-${town.membersArr.length}]`, members2).setURL(link);
        }
    }
    else {
        if (!link) {
            return resEmbed.addField(`Members [${town.membersArr.length}]`, memberList);
        }
        else {
            return resEmbed.addField(`Members [${town.membersArr.length}]`, memberList).setURL(link);
        }
    }
});
//# sourceMappingURL=default.js.map