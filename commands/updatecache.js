const Discord = require("discord.js");
const admin = require("firebase-admin");
const db = admin.firestore();
const cache = require("quick.db");

module.exports = {
  name: "updatecache",
  description: "Updates the cache",
  execute: async (message, args) => {
    if (message.author.id == undefined) {
      let table = new cache.table("CACHE");
      let citiesRef = db.collection("things");
      let allCities = await citiesRef.get()
        .catch(err => {
          console.log("Error getting documents", err);
        });
      if (!allCities) return undefined
    
      let dbKeys = []
      allCities.forEach(doc => {
        dbKeys.push(doc.id)
        table.set(doc.id, {name: doc.data().name, description: doc.data().description, link: doc.data().link, imageLink: doc.data().imageLink, id: doc.id, keywords: doc.data().keywords})
      })
    
      let unusedKeys = table.all().map(x => x.ID).filter(x => !dbKeys.includes(x))
      unusedKeys.forEach(x => table.delete(x))
    }else{
      let table = new cache.table("CACHE");
      let citiesRef = db.collection("things");
      let allCities = await citiesRef.get()
        .catch(err => {
          console.log("Error getting documents", err);
        });
      if (!allCities) return undefined
    
      let dbKeys = []
      allCities.forEach(doc => {
        dbKeys.push(doc.id)
        table.set(doc.id, {name: doc.data().name, description: doc.data().description, link: doc.data().link, imageLink: doc.data().imageLink, id: doc.id, keywords: doc.data().keywords, themeColor: doc.data().themeColor})
      })
    
      let unusedKeys = table.all().map(x => x.ID).filter(x => !dbKeys.includes(x))
      unusedKeys.forEach(x => table.delete(x))
    }
  }
}
    
