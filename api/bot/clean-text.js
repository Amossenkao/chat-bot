const {
	stopWords,
	stopWordsNumbers,
	stopWordsSymbols,
} = require('./data/data');

function cleanText(text, removeNumbers, removeSymbols, removeWords) {
	//Remove contractions
	text = text.replace(/\'m/gi, ' am');
	text = text.replace(/\'re/gi, ' are');
	text = text.replace(/\blet\'s\b/gi, 'let us');
	text = text.replace(/\'s/gi, ' is');
	text = text.replace(/ain\'t/gi, ' is not it');
	text = text.replace(/n\'t/gi, ' not');
	text = text.replace(/\'ll/gi, ' will');
	text = text.replace(/\'d/gi, ' would');
	text = text.replace(/\'ve/gi, ' have');
	text = text.replace(/\lemme/gi, ' let me');
	text = text.replace(/\gimme/gi, ' give me');
	text = text.replace(/\wanna/gi, ' want to');
	text = text.replace(/\gonna/gi, ' going to');
	text = text.replace(/r u /gi, 'are you');
	text = text.replace(/\bim\b/gi, 'i am');
	text = text.replace(/\bwhats\b/gi, 'what is');
	text = text.replace(/\bwheres\b/gi, 'where is');
	text = text.replace(/\bwhos\b/gi, 'who is');

	//Remove numbers
	if (removeNumbers) {
		for (let i = 0; i < stopWordsNumbers.length; i++) {
			var re = new RegExp('\\b' + stopWordsNumbers[i] + '\\b', 'gi');
			text = text.replace(re, '');
			text = text.replace(/[0-9]/gi, ' ').replace(/ \. /gi, ' ');
		}
	}

	//Remove words (very long list!)
	if (removeWords) {
		for (let i = 0; i < stopWords.length; i++) {
			var re = new RegExp('\\b' + stopWords[i] + '\\b', 'gi');
			text = text.replace(re, '');
		}
	}

	//Remove symbols
	if (removeSymbols) {
		for (let i = 0; i < stopWordsSymbols.length; i++) {
			var re = new RegExp('\\' + stopWordsSymbols[i], 'gi');
			text = text.replace(re, '');
		}
	}

	return [...new Set(text.trim().split(/\s+/))];
}

module.exports = cleanText;
