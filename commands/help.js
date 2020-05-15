const Discord = require("discord.js");
const client = new Discord.Client();
const admin = require("firebase-admin");
const db = admin.firestore();

module.exports = {
    name: "help",
    description: "Shows commands and tips and tricks",
    execute(message, args) {
        const helpEmbed = new Discord.RichEmbed()
            .setTitle("Help")
            .setThumbnail('https://cdn.bcow.tk/assets/logo.png')
            .setColor(0xfefefe)
            .addField('1!s [search term]', 'Search OneSearch for towns, nations, discords, and more.')
            .addField('1!n [nation]', 'Finds nation information')
            .addField('1!nonation', 'Gets towns without a nation')
            .addField('1!t [town]', 'Finds town information')
            .addField('1!notown', 'Gets towns without a nation')
            .addField('1!pl or player [username or UUID]', 'Gets player information')
            .addField('1!getall', 'Sends all results in the database to your DMs in pages')
            .addField('**Special Search Results**', '‍')
            .addField('1!calculator [num1] [operator] [num2]', 'Supports addition, subtraction, multiplication, exponents, and division')
            .addField('1!coinflip', 'Flips a coin')
            .addField('1!randomnumber [min] [max]', 'Generates a random number')
            .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png')
        message.channel.send(helpEmbed)
    }
};
