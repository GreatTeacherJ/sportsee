import { type TypeUserActivity } from "@/types/apiTypes";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Sends a user prompt (and optional activity data) to the internal
 * `/api/new-prompt` route, which forwards it to the AI provider.
 *
 * This function never throws: any error (network, server, or API-level)
 * is caught and converted into a user-facing string, so the calling
 * component can always display the return value directly without
 * additional error handling.
 *
 * @param prompt - The user's message to send to the AI assistant.
 * @param UserActivity - The user's session/training data, used as context
 *                        for the AI response. Pass `null` if unavailable.
 * @returns A promise resolving to the AI response text, or a human-readable
 *          error message if the request failed.
 */
export async function getPrompt(
	prompt: string,
	UserActivity: TypeUserActivity | null,
): Promise<string> {
	try {
		const response = await fetch(`${BASE_URL}/api/new-prompt`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: prompt, userActivity: UserActivity }),
		});

		if (!response.ok) {
			// error responses are JSON: { error, message }
			const errorBody = await response.json();
			return errorBody.message ?? "An unexpected error occurred.";
		}

		// success response is plain text, ready to display
		return await response.text();
	} catch (err) {
		// covers network failures, DNS errors, JSON parsing failures, etc.
		console.error("Error in getPrompt", err);
		return "Network error, please try again.";
	}
}
