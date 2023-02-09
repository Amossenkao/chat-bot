const env = process.env;
const express = require('express');
const Bot = require('../bot/bot');
const url = require('url');
const instagramBot = express.Router();
const lineConfig = {
	channelAccessToken: env.CHANNEL_ACCESS_TOKEN,
	channelSecret: env.CHANNEL_SECRET,
};

// botApi.post('/', (req, res) => {
// 	let bot = new Bot(req, res, lineConfig);
// 	Promise.all(req.body.events.map(bot.handleIncomingEvents))
// 		.then((result) => res.json(result))
// 		.catch((error) => res.sendStatus(503));
// });

instagramBot.post('/', (req, res) => {
	console.log(req.body);
});
module.exports = instagramBot;
