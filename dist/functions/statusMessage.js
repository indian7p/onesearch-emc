"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successMessage = exports.errorMessage = void 0;
const Discord = require("discord.js");
exports.errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
exports.successMessage = new Discord.MessageEmbed().setTitle(':white_check_mark: **Success!**').setColor(0x07bf63).setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
//# sourceMappingURL=statusMessage.js.map