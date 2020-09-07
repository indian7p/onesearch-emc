const Discord = require('discord.js');
const fn = require('../../util/fn');
const { Town, Nation, PlayerP } = require('../../models/models');
const { errorMessage } = require('../../functions/statusMessage');
const { paginateArray } = require('../../functions/list');
const { getPlayer } = require('../../functions/fetch');

module.exports = async (message, args) => {
  const actQuery = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');

  const nation = await Nation.findOne({ nameLower: actQuery }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
  if (!nation) return message.channel.send(errorMessage.setDescription('Nation not found.'));

  const towns = await Town.find({ nation: nation.name }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
  if (!towns) return message.channel.send(errorMessage.setDescription('Towns not found.'));

  let playerList = [];
  for (var i = 0; i < towns.length; i++) {
    const town = towns[i];

    town.membersArr.map(member => playerList.push(member));
  }

  let list = [];
  for (var i = 0; i < playerList.length; i++) {
    let member = playerList[i];

    let data = await getPlayer(member);

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
    let page = pages[i];

    const list = page.toString().replace(/,/g, '\n');
    const emb = new Discord.MessageEmbed()
      .setTitle(`Player Activity - ${nation.name}`)
      .setDescription(`\`\`\`${list}\`\`\``)
      .setColor(0x003175)
      .setFooter(`Page ${i + 1}/${pages.length} | OneSearch`, 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png');
    embeds.push(emb);
  }

  message.channel.send(embeds[0]).then((m) => {
    fn.paginator(message.author.id, m, embeds, 0);
  });
  message.channel.stopTyping();
}