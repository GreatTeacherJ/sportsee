import OpenAI, { APIError } from "openai";
import { configDotenv } from "dotenv";

// load environment variables from .env.local (or .env) into process.env
configDotenv();

const TOKEN = process.env.OPENAI_API_KEY;

// fail fast at module load time rather than on the first request:
// if the key is missing, the server should not even start serving this route
if (!TOKEN) {
	throw new Error("OPENAI_API_KEY is missing — check your .env.local file");
}

const openai = new OpenAI({
	apiKey: TOKEN,
});

/**
 * POST /api/new-prompt
 *
 * Receives a user message and optional session activity data, forwards
 * them to the OpenAI Responses API with a fixed system prompt (acting as
 * a sports coach persona), and returns the generated text.
 *
 * All OpenAI-specific errors are translated into a uniform JSON error
 * shape `{ error, message }` so the front-end never needs to know which
 * AI provider is used behind this endpoint.
 *
 * @param request - The incoming HTTP request, expected to contain a JSON
 *                  body of shape `{ message: string, userActivity?: object }`.
 * @returns A `Response` containing either the AI-generated text (success)
 *          or a JSON error object (failure), with an appropriate status code.
 */
export async function POST(request: Request): Promise<Response> {
	try {
		const body = await request.json();
		const message = body.message;
		const userActivity = body.userActivity;

		// basic input validation before calling OpenAI
		// avoids wasting a request/token budget on an obviously bad payload
		if (!message || typeof message !== "string") {
			return Response.json(
				{ error: "invalid_request", message: "Message is missing or invalid." },
				{ status: 400 },
			);
		}

		// format user activity as extra context appended to the system prompt,
		// only if it was actually provided
		let dataActivity = "";
		if (userActivity) {
			dataActivity = "User session data : " + JSON.stringify(userActivity);
		}

		const response = await openai.responses.create({
			model: "gpt-5.4-nano",
			input: [
				{
					role: "system",
					// system prompt defines the assistant's persona, scope, and
					// safety boundaries (medical disclaimer, domain restriction)
					content:
						"Only answer the questions you are asked.\nYou are a sports coach on an app where users track their training session data.\nAlways respond in the same language as the user's message.\nPriority rule: never replace professional medical advice. Redirect to a doctor for persistent pain.\nStay within the sports domain (running, nutrition, recovery).\nIf the question is unrelated to sports, kindly redirect the user and suggest a sport-related alternative question.\nAvoid generic advice — base your answer on the user's session data provided below.\nTone: encouraging and supportive. Congratulate users on their performance." +
						dataActivity,
				},
				{
					role: "user",
					content: message,
				},
			],
			store: true,
			// top_p low + max_output_tokens capped: favors short, focused,
			// low-variance answers over creative/long ones (cost & consistency)
			top_p: 0.25,
			max_output_tokens: 120,
		});

		return new Response(response.output_text, {
			status: 200,
			headers: { "Content-Type": "text/plain" },
		});
	} catch (error) {
		console.error("Erreur lors de l'appel API :", error);

		// the OpenAI SDK throws APIError instances with a `.status` property
		// matching OpenAI's own HTTP status codes — we translate them into
		// our own uniform error shape so the front-end never needs to know
		// which AI provider is behind this route
		if (error instanceof APIError) {
			if (error.status === 429) {
				return Response.json(
					{
						error: "rate_limit",
						message: "Too many requests, please try again later.",
					},
					{ status: 429 },
				);
			}
			if (error.status === 401) {
				// server misconfiguration (invalid/missing API key):
				// never expose this detail to the client for security reasons
				return Response.json(
					{ error: "server_config", message: "Internal server error." },
					{ status: 500 },
				);
			}
			if (error.status === 400) {
				return Response.json(
					{
						error: "bad_request",
						message: "The request could not be processed.",
					},
					{ status: 400 },
				);
			}
		}

		// fallback for anything unexpected (network error, timeout, parsing
		// error, or an APIError status not explicitly handled above)
		return Response.json(
			{ error: "unknown", message: "Internal server error." },
			{ status: 500 },
		);
	}
}
