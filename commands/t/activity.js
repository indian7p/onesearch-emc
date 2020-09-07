const Discord = require('discord.js');
const fn = require('../../util/fn');
const { Town, PlayerP } = require('../../models/models');
const { errorMessage } = require('../../functions/statusMessage');
const { paginateArray } = require('../../functions/list');
const { getPlayer } = require('../../functions/fetch');

module.exports = async (message, args) => {
  const actQuery = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');

  const town = await Town.findOne({ nameLower: actQuery }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

  if (!town) return message.channel.send(errorMessage.setDescription('Town not found.'));

  let list = [];
  for (var i = 0; i < town.membersArr.length; i++) {
    const member = town.membersArr[i];

    const data = await getPlayer(member).catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
    if (data.success != false) {
      PlayerP.findOne({ uuid: data.data.player.raw_id }, function (err, player) {
        if (err) throw err;

        list.push(player == null ? `${member} - Last On: No data` : `${member} - Last On: ${player.lastOnline}`);
      })
    } else {
      list.push(`${member} - Last On: No data`);
    }
  }

  const pages = await paginateArray(list);
  let embeds = [];

  for (var i = 0; i < pages.length; i++) {
    const page = pages[i];

    const list = page.toString().replace(/,/g, '\n');
    const emb = new Discord.MessageEmbed()
      .setTitle(`Player Activity - ${town.name}`)
      .setDescription(`\`\`\`${list}\`\`\``)
      .setColor(0x003175)
      .setFooter(`Page ${i+1}/${pages.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');
    embeds.push(emb);
  }

  message.channel.send(embeds[0]).then((m) => {
    fn.paginator(message.author.id, m, embeds, 0);
  });
  message.channel.stopTyping();
}