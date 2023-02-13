const { ObjectId } = require('mongodb');
const database = require('../database/db');

class ConversationStack {
	constructor(conversation) {
		this.items = conversation?.items ?? [];
		this.size = conversation?.size ?? 0;
	}

	push(...items) {
		this.items.push(...items);
		this.size += items.length;
		return this;
	}

	pop() {
		this.size--;
		return this.items.pop();
	}

	isEmpty() {
		return !this.size;
	}

	peek() {
		return this.items[this.size - 1];
	}

	clear() {
		this.items = [];
		this.size = 0;
		return this;
	}
}

class UserNode {
	constructor(userName, userId, next) {
		this.data = {
			userName: userName || null,
			userId: userId || null,
			pastConversations: new ConversationStack(),
		};
		this.next = next ?? null;
	}
}

class UsersList {
	constructor(currentUserId = null) {
		this.head = null;
		this.userCount = 0;
		this.currentUserId = currentUserId;
	}
	async init() {
		const collection = await database();
		const usersObject = await collection.findOne();
		if (!usersObject) collection.insertOne(this);
		else {
			this.head = await usersObject.head;
			this.userCount = usersObject.userCount;
			this.currentUserId = usersObject.currentUserId;
		}
		return this;
	}

	async addUser(userName, userId) {
		const user = this.getUserById(userId);
		if (user) {
			user.userName = userName;
			this.currentUserId = userId;
			return this;
		}
		if (!this.head) {
			this.head = new UserNode(userName, userId, this.head);
		} else {
			for (let user of this) {
				if (!user.next) user.next = new UserNode(userName, userId);
			}
		}
		this.currentUserId = userId;
		this.userCount++;
		this.updateDatabase();
		return this;
	}

	updateConversation(conversation) {
		let pastConversations = this.getCurrentUser().pastConversations;
		pastConversations.push(conversation);
		this.updateDatabase();
		return this;
	}

	async updateDatabase() {
		await database().then((users) => {
			users.findOneAndReplace(
				{ _id: new ObjectId('63e8c2a158242da2b4e86f96') },
				this
			);
		});
	}

	getUserById(userId) {
		for (let user of this) {
			if (user.data.userId === userId) return user.data;
		}
	}

	getCurrentUser() {
		const user = this.getUserById(this.currentUserId);
		user.pastConversations = new ConversationStack(user.pastConversations);
		return user;
	}

	getUerConversations() {
		return this.getCurrentUser().pastConversations.items.slice(-10);
	}

	async clearUsersList() {
		this.head = null;
		this.userCount = 0;
		this.currentUserId = null;
		await this.updateDatabase();
		return this;
	}

	clearUserConversations() {
		this.getCurrentUser().pastConversations.clear();
		this.updateDatabase();
	}

	printUsersData() {
		for (let user of this) {
			console.log(user.data);
		}
	}

	[Symbol.iterator]() {
		let user = this.head;
		return {
			next: () => {
				let isDone = !user;
				return {
					value: user,
					done: ((user = user?.next), isDone),
				};
			},
		};
	}
}

module.exports = { ConversationStack, UsersList };
