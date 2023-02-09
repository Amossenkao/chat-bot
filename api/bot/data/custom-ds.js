class CustomArray extends Array {
	constructor() {
		if (arguments.length < 2) {
			super(...arguments, null);
			super.pop();
		} else super(...arguments);
	}

	countOf(item) {
		let count = 0;
		for (let element of this) {
			if (element === item) count++;
		}
		return count;
	}

	some(predicate, minimun = 1) {
		let passed = 0;
		let index = 0;
		for (let element of this) {
			if (predicate(element, index++, this)) passed++;
			if (passed >= minimun) return true;
		}
		return false;
	}
}

class ConversationQueue {
	constructor() {
		this.items = new CustomArray();
		this.size = 0;
	}

	enqueue(...items) {
		this.items.push(...items);
		this.size += items.length;
		return this;
	}

	dequeue() {
		this.size--;
		return this.items.shift();
	}

	slide(...items) {
		this.dequeue();
		return this.enqueue(...items);
	}

	isEmpty() {
		return !this.size;
	}

	peek() {
		return this.items[0];
	}

	clear() {
		this.items = new CustomArray();
		this.size = 0;
		return this;
	}
}

class UserNode {
	constructor(userName, userId, next) {
		this.data = {
			userName: userName || null,
			userId: userId || null,
			pastConversations: new ConversationQueue(),
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

	addUser(userName, userId) {
		if (this.getUserById(userId)) {
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
		return this;
	}

	updateConversation(conversation) {
		let pastConversations = this.getCurrentUser().pastConversations;
		if (pastConversations.size < 10) {
			pastConversations.enqueue(conversation);
		} else {
			pastConversations.slide(conversation);
		}
		return this;
	}

	getUserById(userId) {
		for (let user of this) {
			if (user.data.userId === userId) return user.data;
		}
	}

	getCurrentUser() {
		return this.getUserById(this.currentUserId);
	}

	getUerConversations() {
		return this.getCurrentUser().pastConversations.items;
	}

	clearUsersList() {
		this.head = null;
		this.size = 0;
		return this;
	}

	clearUserConversations() {
		this.getCurrentUser().pastConversations.clear();
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

module.exports = { ConversationQueue, UsersList };
