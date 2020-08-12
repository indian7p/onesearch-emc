<img src="https://cdn.bcow.tk/assets/logo.png" width=56/>

# OneSearch

Find towns, nations, and Discord servers with OneSearch for EarthMC. Gets data from the EarthMC map.

OneSearch is split into 2 things to increase reliability and uptime. For the updater service that grabs info from the map and runs the [API](https://github.com/imabritishcow/onesearch-api). See https://github.com/imabritishcow/onesearch-updater

## Example config.json
```json
{
  "MONGOURL": "YOUR MONGODB CONNECTION STRING",
  "TOKEN": "YOUR DISCORD BOT TOKEN",
  "BOT_ADMINS": ["YOUR DISCORD ID"],
  "YT_API_KEY": "YOUR YOUTUBE API KEY",
  "DIALOGFLOW_ENABLED": false,
  "GCP_PROJ": "YOUR GCP PROJECT"
}
```
A YouTube API key is not required if you are not using 1!crawl with YouTube. Dialogflow is used to answer questions will use the [service account](https://cloud.google.com/docs/authentication/getting-started) in your system's environment variables. You can set it up in commands/s.js.

## Links

* [Discord](https://discord.gg/mXrTXhB)
* [API](https://github.com/imabritishcow/onesearch-api)
* [Updater](https://github.com/imabritishcow/onesearch-updater)
* [Status](https://bcow.statuspage.io/)
* [Bot Invite](https://l.bcow.tk/osbot)
* [Trello](https://trello.com/b/LVy0jGYg/onesearch)
