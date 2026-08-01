/**
 * Fichier dédié aux appels API vers une IA.
 *
 * Squelette générique : à compléter selon l'IA choisie
 * (OpenAI, API locale type Ollama, etc.).
 */

/**
 * Envoie un message à l'IA et retourne la réponse.
 *
 * @param prompt - Le message/prompt à envoyer à l'IA
 * @returns La réponse texte de l'IA
 * @throws {Error} Si l'appel à l'API échoue
 *
 * @example
 * const reponse = await callIA("Résume ce graphique");
 */
export async function callIA(prompt: string): Promise<string> {
	// TODO: adapter l'URL, les headers et le body selon l'API choisie
	const response = await fetch("https://api.example.com/v1/chat", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			// Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			prompt,
			// model: "nom-du-modele",
		}),
	});

	if (!response.ok) {
		throw new Error(`IA request failed: ${response.status}`);
	}

	const data = await response.json();

	// TODO: adapter selon le format de réponse de l'API choisie
	return data.response;
}
