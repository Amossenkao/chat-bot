const env = process.env;
const express = require('express');
const Bot = require('../bot/bot');
const lineBot = express.Router();
const lineConfig = {
	channelAccessToken: env.CHANNEL_ACCESS_TOKEN,
	channelSecret: env.CHANNEL_SECRET,
};

lineBot.post('/', async (req, res) => {
	let bot = new Bot(req, res, lineConfig);
	try {
		const result = await req.body.events.map(bot.handleIncomingEvents);
		res.json(result);
	} catch (error) {
		res.sendStatus(503);
	}
});

lineBot.get('/', (req, res) => res.json({ developers: ['Amos', 'Rex'] }));

module.exports = lineBot;
