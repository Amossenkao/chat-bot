const line = require('@line/bot-sdk');
const prompt = require('./prompts');
const { Configuration, OpenAIApi } = require('openai');
const { UsersList } = require('./data/custom-ds');
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const users = new UsersList();
class Bot {
	// Initialize the bot
	constructor(request, response, lineConfig) {
		this.request = request;
		this.response = response;
		this.lineClient = new line.Client(lineConfig);
	}
	// Get the user name and user Id from the webhook object
	getUserInfo = (event) => {
		return new Promise((resolve, reject) => {
			this.userId = event.source.userId;
			const { userId } = this;
			this.lineClient
				.getProfile(userId)
				.then((profile) => {
					users.addUser(profile.displayName, userId);
					resolve(profile.displayName);
				})
				.catch((error) => {
					reject(error);
					console.error('Cannot retrieve user info', error);
				});
		});
	};

	// Make a request to the openai api
	fetchAiResponse = (userName, userPrompt) => {
		if (/delete/gi.test(userPrompt)) {
			users.clearUserConversations();
			return Promise.resolve('past conversations has been deleted...');
		}
		users.updateConversation(`${userName}: ${userPrompt.trim()} `);
		return new Promise((resolve, reject) => {
			openai
				.createCompletion(
					prompt(userName, userPrompt, users.getUerConversations())
				)
				.then((response) => {
					console.log(response.data.usage);
					resolve(response.data.choices[0].text);
				})
				.catch((error) => reject(error));
		});
	};

	// Make a request to the line api to reply to the message
	sendReply = (event, userPrompt, responseText) => {
		responseText = responseText?.trim();
		const replyObject = { type: 'text', text: responseText };
		if (!userPrompt.includes('delete')) {
			users.updateConversation(`Tomodachi: ${responseText} `);
		}

		return this.lineClient.replyMessage(event.replyToken, replyObject);
	};

	//  Finally, this function all the other functions according to the logical flow
	handleIncomingEvents = (event) => {
		if (event.type !== 'message' || event.message.type !== 'text') {
			return Promise.resolve(null);
		}
		const userPrompt = event.message.text?.toLowerCase();

		return new Promise((resolve, reject) => {
			this.getUserInfo(event).then((userName) => {
				this.fetchAiResponse(userName, userPrompt).then((responseText) => {
					resolve(this.sendReply(event, userPrompt, responseText));
				});
			});
		});
	};
}

module.exports = Bot;
