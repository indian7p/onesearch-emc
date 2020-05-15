const Discord = require("discord.js");

const fn = require('/app/util/fn')

module.exports = {
  name: "getall",
  description: "Gets all results",
  execute(message, Result) {
    
    let embeds = []
    Result.find({}, function(err, results) {
      let pageCount = 0;
      results.forEach(result => {
        pageCount++
        let resEmbed = new Discord.RichEmbed()
        .setTitle(result.name)
        .setColor(0x0071bc)
        .setDescription(result.desc)
        .setURL(result.link)
        .setThumbnail(result.imgLink)
        .setFooter(`Page ${pageCount}/${results.length} | OneSearch`, 'https://cdn.bcow.tk/assets/logo.png')
        
        embeds.push(resEmbed)
        if(pageCount == results.length){
          message.channel.send(embeds[0]).then(m => {
            fn.paginator(message.author.id, m, embeds, 0)
          })
        }
      })
    })
  }
}
