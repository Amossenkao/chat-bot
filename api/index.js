const api = require('express').Router();
const line = require('./line');
const instagram = require('./instagram');

api.use('/line', line).use('/instagram', instagram);

module.exports = api;
