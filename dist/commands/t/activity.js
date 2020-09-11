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
const paginator_1 = require("../../functions/paginator");
const models_1 = require("../../models/models");
const statusMessage_1 = require("../../functions/statusMessage");
const list_1 = require("../../functions/list");
const fetch_1 = require("../../functions/fetch");
exports.default = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const actQuery = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');
    const town = yield models_1.Town.findOne({ nameLower: actQuery }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
    if (!town)
        return message.channel.send(statusMessage_1.errorMessage.setDescription('Town not found.'));
    let list = [];
    for (var i = 0; i < town.membersArr.length; i++) {
        const member = town.membersArr[i];
        const data = yield fetch_1.getPlayer(member).catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
        if (data.success != false) {
            const player = yield models_1.PlayerP.findOne({ uuid: data.data.player.raw_id }).exec().catch(err => message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.')));
            list.push(player == null ? `${member} - Last On: No data` : `${member} - Last On: ${player.lastOnline}`);
        }
        else {
            list.push(`${member} - Last On: No data`);
        }
    }
    const pages = yield list_1.paginateArray(list);
    let embeds = [];
    for (var i = 0; i < pages.length; i++) {
        const page = pages[i];
        const list = page.toString().replace(/,/g, '\n');
        const emb = new Discord.MessageEmbed()
            .setTitle(`Player Activity - ${town.name}`)
            .setDescription(`\`\`\`${list}\`\`\``)
            .setColor(0x003175)
            .setFooter(`Page ${i + 1}/${pages.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
        embeds.push(emb);
    }
    message.channel.send(embeds[0]).then((m) => {
        paginator_1.paginator(message.author.id, m, embeds, 0);
    });
    message.channel.stopTyping();
});
//# sourceMappingURL=activity.js.map