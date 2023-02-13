const env = process.env;
const express = require('express');
const Bot = require('../bot/bot');
const lineBot = express.Router();
const lineConfig = {
	channelAccessToken: env.CHANNEL_ACCESS_TOKEN,
	channelSecret: env.CHANNEL_SECRET,
};

lineBot.post('/', (req, res) => {
	let bot = new Bot(req, res, lineConfig);
	Promise.all(req.body.events.map(bot.handleIncomingEvents))
		.then((result) => res.json(result))
		.catch((error) => {
			res.sendStatus(503).send(error)
		});
});

lineBot.get('/', (req, res) => res.json({ developers: ['Amos', 'Rex'] }));

module.exports = lineBot;
