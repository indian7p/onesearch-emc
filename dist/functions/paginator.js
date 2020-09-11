"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginator = void 0;
exports.paginator = (author, msg, embeds, pageNow, addReactions = true) => __awaiter(void 0, void 0, void 0, function* () {
    if (addReactions) {
        yield msg.react('⏪');
        yield msg.react('◀');
        yield msg.react('▶');
        yield msg.react('⏩');
    }
    let reaction = yield msg.awaitReactions((reaction, user) => user.id == author && ['◀', '▶', '⏪', '⏩'].includes(reaction.emoji.name), { time: 240 * 1000, max: 1, errors: ['time'] }).catch(() => { });
    if (!reaction)
        return msg.reactions.removeAll().catch(() => { });
    reaction = reaction.first();
    if (msg.channel.type == 'dm' || !msg.member.hasPermission('MANAGE_MESSAGES')) {
        if (reaction.emoji.name == '◀') {
            let m = yield msg.edit(embeds[Math.max(pageNow - 1, 0)]);
            exports.paginator(author, m, embeds, Math.max(pageNow - 1, 0), false);
        }
        else if (reaction.emoji.name == '▶') {
            let m = yield msg.edit(embeds[Math.min(pageNow + 1, embeds.length - 1)]);
            exports.paginator(author, m, embeds, Math.min(pageNow + 1, embeds.length - 1), false);
        }
        else if (reaction.emoji.name == '⏪') {
            let m = yield msg.edit(embeds[0]);
            exports.paginator(author, m, embeds, 0, false);
        }
        else if (reaction.emoji.name == '⏩') {
            let m = yield msg.edit(embeds[embeds.length - 1]);
            exports.paginator(author, m, embeds, embeds.length - 1, false);
        }
    }
    else {
        if (reaction.emoji.name == '◀') {
            yield reaction.users.remove(author);
            let m = yield msg.edit(embeds[Math.max(pageNow - 1, 0)]);
            exports.paginator(author, m, embeds, Math.max(pageNow - 1, 0), false);
        }
        else if (reaction.emoji.name == '▶') {
            yield reaction.users.remove(author);
            let m = yield msg.edit(embeds[Math.min(pageNow + 1, embeds.length - 1)]);
            exports.paginator(author, m, embeds, Math.min(pageNow + 1, embeds.length - 1), false);
        }
        else if (reaction.emoji.name == '⏪') {
            yield reaction.users.remove(author);
            let m = yield msg.edit(embeds[0]);
            exports.paginator(author, m, embeds, 0, false);
        }
        else if (reaction.emoji.name == '⏩') {
            yield reaction.users.remove(author);
            let m = yield msg.edit(embeds[embeds.length - 1]);
            exports.paginator(author, m, embeds, embeds.length - 1, false);
        }
    }
});
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
//# sourceMappingURL=paginator.js.map