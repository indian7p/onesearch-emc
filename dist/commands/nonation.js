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
const statusMessage_1 = require("../functions/statusMessage");
const paginator_1 = require("../functions/paginator");
exports.default = {
    name: 'nonation',
    description: 'Searches for towns without nations',
    execute(message, args, Town, Nation, client) {
        message.channel.startTyping();
        Nation.findOne({ nameLower: 'no_nation' }, function (err, nation) {
            if (nation == null) {
                message.channel.stopTyping();
                message.channel.send(statusMessage_1.errorMessage.setDescription('The database may be updating, try again in a minute.'));
            }
        });
        let sortingOpts;
        switch (args[1]) {
            default:
            case 'members':
                sortingOpts = { residents: 'desc' };
                break;
            case 'area':
                sortingOpts = { area: 'desc' };
                break;
        }
        Town.find({ nation: 'No Nation' }).sort(sortingOpts).exec(function (err, towns) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.'));
                if (!towns)
                    return message.channel.send(statusMessage_1.errorMessage.setDescription('The database may be updating. Try again later.'));
                Nation.findOne({ name: "No_Nation" }, function (err, nation) {
                    if (err)
                        return message.channel.send(statusMessage_1.errorMessage.setDescription('An error occurred.'));
                    if (!nation)
                        return message.channel.send(statusMessage_1.errorMessage.setDescription('The database may be updating. Try again later.'));
                    let townList = [];
                    towns.forEach(town => {
                        townList.push(`${town.name.replace(/_/g, '\_')} - Members: ${town.residents} - Area: ${town.area}`);
                    });
                    let pages = townList.map(() => townList.splice(0, 10)).filter(a => a);
                    let embeds = [];
                    let pageNum = 0;
                    pages.forEach(page => {
                        pageNum++;
                        let list = page.toString().replace(/,/g, '\n');
                        let embed = new Discord.MessageEmbed()
                            .setTitle('No Nation')
                            .addField('Towns', townList.length, true)
                            .addField('Residents', nation.residents, true)
                            .setDescription(`\`\`\`${list}\`\`\``)
                            .setColor(0x003175)
                            .setFooter(`Page ${pageNum}/${pages.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
                        embeds.push(embed);
                    });
                    message.channel.send(embeds[0]).then((m) => {
                        paginator_1.paginator(message.author.id, m, embeds, 0);
                    });
                    message.channel.stopTyping();
                });
            });
        });
    }
};
//# sourceMappingURL=nonation.js.map