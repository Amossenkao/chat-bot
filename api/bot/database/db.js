const { MongoClient } = require('mongodb');

async function database() {
	const client = new MongoClient(process.env.MONGO_DB_URI);
	try {
		const user = await client.db('chat-bot').collection('users');
		return users;
	} catch (error) {
		console.log(error);
	} finally {
		// client.close();
	}
}

module.exports = database;
