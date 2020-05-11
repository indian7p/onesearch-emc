const Discord = require("discord.js");
const cache = require("quick.db");
const admin = require("firebase-admin");
const db = admin.firestore();

const fn = require('/app/util/fn')

module.exports = {
  name: "getall",
  description: "Gets all the document names",
  execute: async (message, args) => {
    let table = new cache.table("CACHE")
    
    let embeds = []
    
    let keys = table.all().map(x => x.ID)
    for (const key of keys) {
      let data = table.get(key)

      embeds.push(
        new Discord.RichEmbed()
        .setTitle(data.name)
        .setColor(0xfefefe)
        .setDescription(data.description)
        .setURL(data.link)
        .setThumbnail(data.imageLink)
        .setFooter(`Page ${keys.indexOf(key)+1}/${keys.length} | OneSearch`, 'https://cdn.bcow.tk/assets/logo.png')
      )
    }
    
    let m = await message.channel.send(embeds[0])
    fn.paginator(message.author.id, m, embeds, 0)
  }
} 