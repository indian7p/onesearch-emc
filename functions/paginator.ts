export const paginator = async (author, msg, embeds, pageNow, addReactions = true) => {
  if (addReactions) {
    await msg.react('⏪')
    await msg.react('◀')
    await msg.react('▶')
    await msg.react('⏩')
  }
  let reaction = await msg.awaitReactions((reaction, user) => user.id == author && ['◀', '▶', '⏪', '⏩'].includes(reaction.emoji.name), { time: 240 * 1000, max: 1, errors: ['time'] }).catch(() => { })
  if (!reaction) return msg.reactions.removeAll().catch(() => { })
  reaction = reaction.first()

  if (msg.channel.type == 'dm' || !msg.member.hasPermission('MANAGE_MESSAGES')) {
    if (reaction.emoji.name == '◀') {
      let m = await msg.edit(embeds[Math.max(pageNow - 1, 0)])
      paginator(author, m, embeds, Math.max(pageNow - 1, 0), false)
    } else if (reaction.emoji.name == '▶') {
      let m = await msg.edit(embeds[Math.min(pageNow + 1, embeds.length - 1)])
      paginator(author, m, embeds, Math.min(pageNow + 1, embeds.length - 1), false)
    } else if (reaction.emoji.name == '⏪') {
      let m = await msg.edit(embeds[0])
      paginator(author, m, embeds, 0, false)
    } else if (reaction.emoji.name == '⏩') {
      let m = await msg.edit(embeds[embeds.length - 1])
      paginator(author, m, embeds, embeds.length - 1, false)
    }
  } else {
    if (reaction.emoji.name == '◀') {
      await reaction.users.remove(author)
      let m = await msg.edit(embeds[Math.max(pageNow - 1, 0)])
      paginator(author, m, embeds, Math.max(pageNow - 1, 0), false)
    } else if (reaction.emoji.name == '▶') {
      await reaction.users.remove(author)
      let m = await msg.edit(embeds[Math.min(pageNow + 1, embeds.length - 1)])
      paginator(author, m, embeds, Math.min(pageNow + 1, embeds.length - 1), false)
    } else if (reaction.emoji.name == '⏪') {
      await reaction.users.remove(author)
      let m = await msg.edit(embeds[0])
      paginator(author, m, embeds, 0, false)
    } else if (reaction.emoji.name == '⏩') {
      await reaction.users.remove(author)
      let m = await msg.edit(embeds[embeds.length - 1])
      paginator(author, m, embeds, embeds.length - 1, false)
    }
  }
}

/*let compare = (a, b) => {
  const A = a.residents;
  const B = b.residents;

  let comparison = 0;
  if (A > B) {
    comparison = 1;
  } else if (A < B) {
    comparison = -1;
  }
  return comparison * -1;
}

let truncate = (text, length) => {
  if (text.length <= length) {
    return text;
  }

  return text.substr(0, length) + '\u2026'
}*/