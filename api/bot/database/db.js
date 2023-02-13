const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_DB_URI);
async function database() {
	try {
		const database = client.db('chat-bot');
		var users = database.collection('users');
		return users;
	} catch (error) {
		console.log(error);
		return error;
	}
}

module.exports = { client, database };
