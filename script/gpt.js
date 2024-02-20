const axios = require("axios");

const config = {
	name: "gpt",
	version: "1.0.0",
	role: 0,
	credits: "Marky",
	description: "OpenAI official AI with no prefix",
	aliases: ["yaz"],
	hasPrefix: false,
	usages: "...",
	cooldown: 0
};

module.exports.handleEvent = async function ({ api, event }) {
	if (event.body.indexOf("gpt") === 0 || event.body.indexOf("yaz") === 0) {
		const { threadID, messageID, body } = event;
		const input = body;
		const message = input.split(" ");

		if (message.length < 2) {
			api.sendMessage("Please provide a question first.", threadID, messageID);
		} else {
			try {
				api.sendMessage('Please bear with me while I ponder your request...', threadID, messageID);
				const ris = await axios.get(`https://garfieldapi.cyclic🥹app/api/gpt4?query=${message.slice(1).join(" ")}`);
				const result = ris.data.Mark;
				const Mark = `🎃:\n\n${result}`;
				api.sendMessage(Mark, threadID, messageID);
			} catch (err) {
				console.error(err);
				api.sendMessage("We apologize for the inconvenience, but we were unable to send your answer at this time. Please try again later.", threadID, messageID);
			}
		}
	}
};

module.exports.run = async function ({ api, event }) {
};
