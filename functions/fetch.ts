import fetch from 'node-fetch';

export async function getPlayer(player) {
  const res = await fetch(`https://playerdb.co/api/player/minecraft/${player}`);
  const data = await res.json();
  return data;
}

export async function getPlayerCount() {
  const res = await fetch(`https://35hooghtcc.execute-api.us-east-1.amazonaws.com/prod/getServerInfo`);
  const data = await res.json();
  return data;
}

export async function getMapData() {
  const res = await fetch("https://earthmc.net/map/up/world/earth/");
  const data = await res.json();
  return data;
}

export async function getBetaMap() {
  const res = await fetch("https://earthmc.net/map/beta/up/world/randomworld1/");
  const data = await res.json();
  return data;
}

export async function getClassicMap() {
  const res = await fetch("https://earthmc.net/map/classic/up/world/earth/");
  const data = await res.json();
  return data;
}