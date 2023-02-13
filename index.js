require('dotenv').config();
const express = require('express');
const ip = require('ip');
const api = require('./api');
const PORT = process.env.PORT || 8080;
const { client } = require('./api/bot/database/db');

const app = express();
app.use(express.json());
app.use('/api', api).get('/', (req, res) => {
	res.status(404).send(`This probably isn't what you're looking for...`);
});

client.connect((err) => {
	if (err) {
		console.error(err);
		return false;
	}
	app.listen(PORT, () => {
		console.log(`App is listening to port: ${PORT} on IP: ${ip.address()}`);
	});
});
