const Discord = require('discord.js');
const cache = require('quick.db');
const nationsP = new cache.table('nationsP');
const casst = new cache.table('casst');
const fn = require('../util/fn');

module.exports = {
	name: 'nonation',
	description: 'Searches for towns without nations',
	execute: async (message, args, Town, Nation) => {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
		message.channel.startTyping();
		var query = message.content.slice(5).toLowerCase().replace(/ /g, '_');
		Nation.findOne({ nameLower: 'no_nation' }, async function(err, nation2) {
			if (nation2 == null) {
				message.channel.stopTyping();
				message.channel.send(errorMessage.setDescription('The database may be updating, try again in a minute.'));
			}
			if (nation2.townsArr.toString().length > 1024) {
				var counter = 0;
				let members1 = [];
				let members2 = [];
				let members3 = [];
				let members4 = [];
				let members5 = [];
				let members6 = [];
				let members7 = [];
				let members8 = [];
				let members9 = [];
				let members10 = [];
				let arraysArr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
				var pageNum = 0;
				nation2.townsArr.forEach((member) => {
					counter++;
					if (counter <= 50) {
						members1.push(member);
					} else {
						if (counter <= 100) {
							members2.push(member);
						} else {
							if (counter <= 150) {
								members3.push(member);
							} else {
								if (counter <= 200) {
									members4.push(member);
								} else {
									if (counter <= 250) {
										members5.push(member);
									} else {
										if (counter <= 300) {
											members6.push(member);
										} else {
											if (counter <= 350) {
												members7.push(member);
											} else {
												if (counter <= 400) {
													members8.push(member);
												} else {
													if (counter <= 450) {
														members9.push(member);
													} else {
														if (counter <= 500) {
															members10.push(member);
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				});
				let embedsArr = [];
				arraysArr.forEach((value) => {
					switch (value) {
						case 1:
							var townsList = '```' + members1.toString().replace(/,/g, ', ') + '```';
							break;
						case 2:
							var townsList = '```' + members2.toString().replace(/,/g, ', ') + '```';
							break;
						case 3:
							var townsList = '```' + members3.toString().replace(/,/g, ', ') + '```';
							break;
						case 4:
							var townsList = '```' + members4.toString().replace(/,/g, ', ') + '```';
							break;
						case 5:
							var townsList = '```' + members5.toString().replace(/,/g, ', ') + '```';
							break;
						case 6:
							var townsList = '```' + members6.toString().replace(/,/g, ', ') + '```';
							break;
						case 7:
							var townsList = '```' + members7.toString().replace(/,/g, ', ') + '```';
							break;
						case 8:
							var townsList = '```' + members8.toString().replace(/,/g, ', ') + '```';
							break;
						case 9:
							var townsList = '```' + members9.toString().replace(/,/g, ', ') + '```';
							break;
						case 10:
							var townsList = '```' + members10.toString().replace(/,/g, ', ') + '```';
							break;
					}
					pageNum++;
					let resEmbed = new Discord.MessageEmbed()
						.setTitle('No Nation')
						.setColor(0x0071bc)
						.addField('Residents', nation2.residents)
						.addField(`Towns [${nation2.townsArr.length}]`, townsList)
						.setFooter(`Page ${pageNum}-${arraysArr.length} | OneSearch`, 'https://cdn.bcow.tk/assets/logo.png');
					embedsArr.push(resEmbed);
				});
				let m = await message.channel.send(embedsArr[0]);
				fn.paginator(message.author.id, m, embedsArr, 0);
				message.channel.stopTyping();
			}
		});
	}
};
