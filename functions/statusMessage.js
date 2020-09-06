const Discord = require('discord.js');

const error = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', client.user.avatarURL());
const success = new Discord.MessageEmbed().setTitle(':white_check_mark: **Success!**').setColor(0x07bf63).setFooter('OneSearch', client.user.avatarURL());

module.exports = {
  errorMessage: error,
  successMessage: success
};