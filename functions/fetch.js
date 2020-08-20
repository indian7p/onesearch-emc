const fetch = require('node-fetch');

async function getPlayer(player) {
  let res = await fetch(`https://playerdb.co/api/player/minecraft/${player}`)
  let data = await res.json()
  return data;
}

module.exports = {
  getPlayer: getPlayer
}