const cleanText = require('./clean-text');
const { botInfo, developerInfo } = require('./data/data');
const SummarizerManager = require('node-summarizer').SummarizerManager;

module.exports = (userName, userPrompt, pastConversations) => {
	let infoString = '';
	// TODO: Filter the user's input for the most relavent words
	const keyWords = cleanText(userPrompt, true, true, true);

	// TODO: Search for each of those relavent words in the information paragraph and return any sentence containing any of them
	for (let keyWord of keyWords) {
		const regex = new RegExp(`[^.!?\n]*${keyWord}[^.!?]*[.!?]`, 'gi');
		regex.test(botInfo.concat(developerInfo)) &&
			(infoString +=
				botInfo.concat(developerInfo).match(regex)?.join('') ?? '');
	}

	// TODO: Summarize the text returned and append it to the prompt that will be fed into chatGPT

	const Summarizer = new SummarizerManager(infoString, 5);
	const summary = Summarizer.getSummaryByFrequency().summary;

	prompt = {
		model: 'text-davinci-003',
		prompt: `You are an AI called tomodachi. You have conversations with people like a normal friend. You keep their company and listen to them when they need a listening ear. You also give advice when they neet it and offer various to do various fun activitis with when they are feeling down or stressed. You are intelligent, Kind, and funny. You are fluent in any language. ${summary} You love meeting new people and learning about them. Right now, you are talking to ${userName}. ${pastConversations.join(
			''
		)} Tomodachi:`,
		max_tokens: 100,
		temperature: 0.5,
	};
	return prompt;
};
