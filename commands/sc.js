/*const Discord = require('discord.js');
const cache = require('quick.db');
const fn = require('/app/util/fn');
const nations = new cache.table('nations');

module.exports = {
	name: 'sc',
	description: 'Opens Search Console',
	execute: async (message, args, client, Town, Nation) => {
		let errorMessage = new Discord.RichEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
		let docRef = db.collection('users').doc(`<@${message.author.id}>`);

		docRef.get()
			.then(function(doc) {
				if (doc.exists) {
					//Sign-in flow
				} else {
					let noSCEmbed = new Discord.RichEmbed()
            .setTitle('Welcome to Search Console')
            .setDescription('Search Console gives you insights into your audience. See how your results perform and manage your search results. React with :white_check_mark: to start sign-up.')
            .setColor(0x0071bc)
            .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
            message.channel.send(noSCEmbed).then(m => {
              m.react('✅').then(async (hej) => {
                let reaction1 = await msg.awaitReactions((reaction, user) => user.id == message.author.id && [ '✅' ].includes(reaction.emoji.name), { max: 1, errors: [ 'time' ] }).catch(() => {});
                if (!reaction1) return msg.clearReactions().catch(() => {});
                reaction1 = reaction1.first();
                if(reaction1.emoji.name == '✅') {
                  let step1 = new Discord.RichEmbed()
                  .setTitle('Step 1 - Create your first property')
                  .setDescription('Have a discord server or EarthMC related website? Add it by sending a message with the name of the result, the link, a link to an image (attachment not supported yet), a short description, and a theme color (optional). Your result will then be reviewed. Have a nation? ')
                  .setColor(0x0071bc)
                  .setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
                }
              })
            })
				}
			})
			.catch(function(error) {
				console.log('Error getting document:', error);
			});
	}
};*/