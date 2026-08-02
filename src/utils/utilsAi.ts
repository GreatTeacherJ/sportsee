import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { configDotenv } from "dotenv";
import userActivity from "@/AllUserActivity.json";
import { type TypeUserActivity } from "@/types/apiTypes";

configDotenv();

const BASE_URL = process.env.BASE_URL;

export async function getPrompt(
	prompt: string,
	UserActivity: TypeUserActivity,
): Promise<string | undefined> {
	try {
		console.log("debut du lancement de testeRoute");
		const response = await fetch(`${BASE_URL}/api/new-prompt`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: prompt, userActivity: UserActivity }),
		});

		const data = await response.text();

		return data;
	} catch (err) {
		console.error("Error in testeRoute", err);
	}
}

const rl = createInterface({ input: stdin, output: stdout });

(async () => {
	const prompt = await rl.question("Entrez votre prompt : ");
	const res = await getPrompt(prompt, userActivity);
	console.log("reponse : ", res);
	rl.close();
})();
