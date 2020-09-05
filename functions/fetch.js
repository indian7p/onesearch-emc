const fetch = require('node-fetch');
const { QueueData } = require('../models/models');

async function getPlayer(player) {
  const res = await fetch(`https://playerdb.co/api/player/minecraft/${player}`)
  const data = await res.json()
  return data;
}

async function getPlayerCount() {
  const res = await fetch(`https://35hooghtcc.execute-api.us-east-1.amazonaws.com/prod/getServerInfo`);
  const data = await res.json();
  return data;
}

async function getMapData() {
  const res = await fetch("https://earthmc.net/map/up/world/earth/")
  const data = await res.json()
  return data;
}

async function getQueueTrainingData() {
  //Clean data
  await QueueData.deleteMany({playersOnTotal: 0}).exec().catch(err => {});

  const qdatas = await QueueData.find({}).exec().catch(err => {});

  let labels = [];
  let features = [];

  for(var i=0; i<qdatas.length; i++) {
    let qdata = qdatas[i];

    labels.push(qdata.timestamp);
    features.push(qdata.queue);
  }

  return {labels: labels, features: features}
}

module.exports = {
  getPlayer: getPlayer,
  getPlayerCount: getPlayerCount,
  getMapData: getMapData,
  getQueueTrainingData: getQueueTrainingData
}