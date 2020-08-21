const fetch = require('node-fetch');

async function getPlayer(player) {
  const res = await fetch(`https://playerdb.co/api/player/minecraft/${player}`)
  const data = await res.json()
  return data;
}

async function getPlayerCount(ip) {
  const res = await fetch(`https://mcapi.us/server/status?ip=${ip}`);
  const data = await res.json();
  return data;
}

async function getMapData() {
  const res = await fetch("https://earthmc.net/map/up/world/earth/")
  const data = await res.json()
  return data;
}

module.exports = {
  getPlayer: getPlayer,
  getPlayerCount: getPlayerCount,
  getMapData: getMapData
}