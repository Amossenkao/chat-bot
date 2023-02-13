require('dotenv').config();
const express = require('express');
const ip = require('ip');
const api = require('./api');
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use('/api', api).get('/', (req, res) => {
	res.status(404).send(`This probably isn't what you're looking for...`);
});

app.listen(PORT, () => {
	console.log(`App is listening to port: ${PORT} on IP: ${ip.address()}`);
});
