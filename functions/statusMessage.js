const Discord = require('discord.js');

const embed = new Discord.MessageEmbed().setThumbnail('https://cdn.bcow.tk/assets/logo-new.png').setColor(0x003175).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
const error = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
const success = new Discord.MessageEmbed().setTitle(':white_check_mark: **Success!**').setColor(0x07bf63).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');

module.exports = {
  errorMessage: error,
  successMessage: success,
  embed: embed
};