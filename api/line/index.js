const env = process.env;
// const express = require('express');
const Bot = require('../bot/bot');
// const lineBot = express.Router();
const lineConfig = {
	channelAccessToken: env.CHANNEL_ACCESS_TOKEN,
	channelSecret: env.CHANNEL_SECRET,
};

module.exports = async (req, res) => {
	let bot = new Bot(req, res, lineConfig);
	try {
		const result = await req.body.events.map(bot.handleIncomingEvents);
		console.log('Got result from the line/index.jsf file', result);
		(await result) &&
			Promise.all(result).then((response) => res.json(response));
	} catch (error) {
		console.log('Got error from the line/index.js file');
		res.sendStatus(503);
	}
};
