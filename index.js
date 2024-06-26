import openai from "./openai.js";
import readlineSync from "readline-sync";
import colors from "colors";

async function main() {
	console.log(colors.bold.green("Welcome to the Chatbot Program!"));
	console.log(colors.bold.green("You can start chatting with the bot."));

	const chatHistory = []; // Store conversation history

	while (true) {
		const userInput = readlineSync.question(colors.yellow("You: "));

		try {
			// Construct messages by iterating over the history
			const messages = chatHistory.map(([role, content]) => ({
				role,
				content,
			}));

			// Add latest user input
			messages.push({ role: "user", content: userInput });

			// Call the API with user input & history
			const completion = await openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: messages,
			});
			// Log the entire completion object to the console
			// console.log("Completion object:", completion);
			// Check if completion and choices exist
			if (completion && completion.choices && completion.choices.length > 0) {
				// Get completion text/content
				const completionText = completion.choices[0].message.content;

				if (userInput.toLowerCase() === "exit") {
					console.log(colors.green("Bot: ") + completionText);
					return;
				}

				console.log(colors.green("Bot: ") + completionText);

				// Update history with user input and assistant response
				chatHistory.push(["user", userInput]);
				chatHistory.push(["assistant", completionText]);
			} else {
				console.error(colors.red("Error: Empty response from the API"));
			}
		} catch (error) {
			console.error(colors.red(error));
		}
	}
}

main();
