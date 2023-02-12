const { MongoClient } = require('mongodb');

async function database() {
	const client = new MongoClient(
		`mongodb+srv://senkao:94QjHVZ6Igw4SfHW@cluster0.ntedyrc.mongodb.net/fullstack-app`
	);
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