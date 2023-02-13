const { MongoClient } = require('mongodb');

async function database() {
	const client = new MongoClient(process.env.MONGO_DB_URI);
	try {
		const database = client.db('chat-bot');
		const users = await database.collection('users');
		return users;
	} catch (error) {
		console.log(error);
	} finally {
		// client.close();
	}
}

module.exports = database;
