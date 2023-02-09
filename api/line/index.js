const env = process.env;
// const express = require('express');
const Bot = require('../bot/bot');
// const lineBot = express.Router();
const lineConfig = {
	channelAccessToken: env.CHANNEL_ACCESS_TOKEN,
	channelSecret: env.CHANNEL_SECRET,
};
let count = 0;
setInterval(() => {
	console.log(++count);
}, 1000);
module.exports = (req, res) => {
	let bot = new Bot(req, res, lineConfig);
	Promise.all(req.body.events.map(bot.handleIncomingEvents))
		.then((response) => {
			res.json(response);
		})
		.catch((error) => {
			console.log(error);
			res.sendStatus(503);
		});
};
