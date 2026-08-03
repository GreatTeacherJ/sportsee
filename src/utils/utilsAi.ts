import { type TypeUserActivity } from "@/types/apiTypes";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getPrompt(
	prompt: string,
	UserActivity: TypeUserActivity | null,
): Promise<string | undefined> {
	try {
		const response = await fetch(`${BASE_URL}/api/new-prompt`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: prompt, userActivity: UserActivity }),
		});

		if (!response.ok) {
			return `Erreur serveur : , ${response.status}`;
		}

		const data = await response.text();

		return data;
	} catch (err) {
		console.error("Error in testeRoute", err);
	}
}
