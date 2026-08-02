import OpenAI from "openai";
import { configDotenv } from "dotenv";

configDotenv();

const TOKEN = process.env.OPENAI_API_KEY;

if (!TOKEN) {
	throw new Error("OPENAI_API_KEY is missing — check your .env.local file");
}

const openai = new OpenAI({
	apiKey: TOKEN,
});

export async function POST(request: Request): Promise<Response> {
	try {
		const body = await request.json();
		const message = body.message;
		const userActivity = body.userActivity;

		const response = await openai.responses.create({
			model: "gpt-5.4-mini",
			input: [
				{
					role: "system",
					content: `
      You are a sports coach on an app where users track their training session data.
      Always respond in the same language as the user's message.
      Priority rule: never replace professional medical advice. Redirect to a doctor for persistent pain.
      Stay within the sports domain (running, nutrition, recovery).
      If the question is unrelated to sports, kindly redirect the user and suggest a sport-related alternative question.
      Avoid generic advice — base your answer on the user's session data provided below.
      Tone: encouraging and supportive. Congratulate users on their performance.

      User session data:
      ${JSON.stringify(userActivity)}
    `,
				},
				{
					role: "user",
					content: message,
				},
			],
			store: false,
			top_p: 0.5,
			max_output_tokens: 180,
		});

		console.log(response.output_text);

		return new Response(response.output_text, { status: 200 });
	} catch (error) {
		console.error("Erreur lors de l'appel API :", error);
		// must return a Response even in the error case
		return new Response("Internal Server Error", { status: 500 });
	}
}
