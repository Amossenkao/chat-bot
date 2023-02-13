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
	getUserInfo = async (event) => {
		await users.init();
		this.userId = event.source.userId;
		const { userId } = this;
		try {
			const profile = await this.lineClient.getProfile(userId);
			await users.addUser(profile.displayName, userId);
			console.log('Got user profile name: ', profile.displayName);
			return profile.displayName;
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	// Make a request to the openai api
	fetchAiResponse = async (userName, userPrompt) => {
		if (/delete/gi.test(userPrompt)) {
			await users.clearUserConversations();
			// await users.clearUsersList();
			return 'past conversations has been deleted...';
		}
		await users.updateConversation(`${userName}: ${userPrompt.trim()}`);

		try {
			const response = await openai.createCompletion(
				prompt(userName, userPrompt, users.getUerConversations())
			);
			console.log(response.data.usage);
			return response.data.choices[0].text;
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	// Make a request to the line api to reply to the message
	sendReply = async (event, userPrompt, responseText) => {
		responseText = responseText?.trim();
		const replyObject = { type: 'text', text: responseText };
		if (!userPrompt.includes('delete')) {
			users.updateConversation(`Tomodachi: ${responseText}`);
		}
		const reply = await this.lineClient.replyMessage(
			event.replyToken,
			replyObject
		);
		return reply;
	};

	//  Finally, this function calls all the other functions according to the logical flow
	handleIncomingEvents = async (event) => {
		if (event.type !== 'message' || event.message.type !== 'text') {
			return null;
		}
		const userPrompt = event.message.text?.toLowerCase();
		try {
			const userName = await this.getUserInfo(event);
			const responseText = await this.fetchAiResponse(userName, userPrompt);
			const output = await this.sendReply(event, userPrompt, responseText);
			return output;
		} catch (error) {
			return error;
		}
	};
}

module.exports = Bot;
