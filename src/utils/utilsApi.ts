import type {
	TypeProfile,
	TypeStatisitcs,
	TypeUserInfo,
	TypeUserActivity,
	TypeUserStatistics,
	TypeDatasGraph,
	TypeSession,
} from "@/types/apiTypes";
import Cookies from "js-cookie";

/**
 * Retourne un message d'erreur lisible en fonction du code de statut HTTP reçu.
 *
 * Cette fonction mappe les codes d'erreur HTTP courants à des messages d'erreur
 * en français adaptés pour affichage à l'utilisateur.
 *
 * @param responseStatus - Le code de statut HTTP reçu de l'API
 * @returns Un message d'erreur en français correspondant au code d'erreur
 *
 * @example
 * const message = responseStatus(404); // "Ressource non trouvées"
 */
export function responseStatus(responseStatus: number): string {
	// Traitement du code de statut reçu
	switch (responseStatus) {
		case 403: // Accès interdit
			return "Identification impossible";

		case 400: // Mauvaise requête
			return "Nom d'utilisateur ou mot de passe incorecte";

		case 401: // Non autorisé
			return "Identification impossible";

		case 404: // Non trouvé
			return "Ressource non trouvées";

		case 500: // Erreur serveur interne
			return "Une érreur serveur est intérvenue, veuillez réésayer plus tard";

		default: // Code d'erreur non géré
			return "Une érreur inconue est intérvenue, veuillez réésayer plus tard";
	}
}

/**
 * Récupère les informations de l'utilisateur connecté depuis l'API.
 *
 * Cette fonction effectue une requête authentifiée pour obtenir le profil
 * et les statistiques de l'utilisateur actuellement connecté. Elle nécessite
 * un token JWT stocké dans les cookies.
 *
 * @async
 * @returns {Promise<TypeUserInfo>} Un objet contenant le profil et les statistiques de l'utilisateur
 * @throws {Error} Si aucun token d'authentification n'est trouvé ou si la requête échoue
 *
 * @example
 * try {
 *   const userInfo = await getApiUserInfo();
 *   console.log(userInfo.profile.name);
 * } catch (error) {
 *   console.error("Impossible de récupérer les infos utilisateur");
 * }
 */
export async function getApiUserInfo(): Promise<TypeUserInfo> {
	// Récupération du token JWT depuis les cookies
	const token = Cookies.get("token");

	// Vérification de la présence du token d'authentification
	if (!token) {
		throw new Error("No authentication token found");
	}

	try {
		// Appel à l'API pour récupérer les informations utilisateur
		const response = await fetch("http://localhost:8000/api/user-info", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		// Gestion des erreurs HTTP (401, 403, 5xx, etc.)
		if (!response.ok) {
			throw new Error(`Failed to fetch user info: ${response.status}`);
		}

		// Parsing de la réponse JSON
		const userInfo: TypeUserInfo = await response.json();

		// Extraction du profil et des statistiques
		const profile: TypeProfile = userInfo.profile;
		const statistics: TypeStatisitcs = userInfo.statistics;

		return { profile, statistics };
	} catch (error) {
		console.error("Error fetching user info:", error);
		throw error; // Laisse error.tsx gérer l'affichage de l'erreur
	}
}

/**
 * Récupère une image depuis une URL et retourne une URL d'objet blob.
 *
 * Cette fonction télécharge une image et la convertit en Object URL (blob URL)
 * pour une utilisation dans le DOM. En cas d'erreur, une image par défaut est retournée.
 *
 * @async
 * @param {string | null} filename - L'URL de l'image à récupérer, ou null
 * @returns {Promise<string | null>} Une URL d'objet blob (blob:// URL) ou une image par défaut en cas d'erreur
 *
 * @warning Attention: Il faut libérer l'Object URL avec `URL.revokeObjectURL()` lors de la déconnexion
 *          pour éviter une fuite mémoire.
 *
 * @example
 * const avatarUrl = await getApiImage("https://api.example.com/avatar.png");
 * img.src = avatarUrl;
 * // Au logout: URL.revokeObjectURL(avatarUrl);
 */
export async function getApiImage(filename: string | null): Promise<string | null> {
	// Gestion du cas où filename est null ou vide
	if (!filename) {
		return null;
	}

	try {
		// Téléchargement de l'image
		const response = await fetch(filename);

		// Vérification manuelle du statut HTTP (fetch ne lance pas d'erreur sur 404/500)
		if (!response.ok) {
			throw new Error(
				`Failed to fetch image: ${response.status} ${response.statusText}`,
			);
		}

		// Conversion de la réponse en blob
		const blob = await response.blob();

		// Création d'une URL d'objet blob (blob:// URL) pour utilisation dans le DOM
		// ⚠️ IMPORTANT: Supprimer l'Object URL avec URL.revokeObjectURL() à la déconnexion
		// pour éviter une fuite mémoire
		const avatarUrl = URL.createObjectURL(blob);

		return avatarUrl;
	} catch (error) {
		// Log pour le débogage: permet de distinguer erreur réseau, erreur HTTP, ou erreur de parsing
		console.error(`Error loading avatar image "${filename}":`, error);

		// Retour d'une image par défaut pour éviter les bris d'interface
		return "/images/avatar.png";
	}
}

/**
 * Récupère l'historique d'activité de l'utilisateur depuis l'API.
 *
 * Cette fonction effectue une requête authentifiée pour obtenir toutes les sessions
 * d'activité de l'utilisateur entre une date de départ et aujourd'hui. Elle retourne
 * un tableau de sessions contenant des informations de distance, durée, calories, etc.
 *
 * @async
 * @param {string} createdAt - La date de départ au format ISO (YYYY-MM-DD)
 * @returns {Promise<TypeUserActivity>} Un tableau de sessions d'activité de l'utilisateur
 * @throws {Error} Si aucun token d'authentification n'est trouvé ou si la requête échoue
 *
 * @example
 * const activity = await getApiUserActivity("2024-01-01");
 * console.log(activity[0].distance); // Distance de la première session
 */
export async function getApiUserActivity(createdAt: string): Promise<TypeUserActivity> {
	// Récupération du token JWT depuis les cookies
	const token = Cookies.get("token");

	// Vérification de la présence du token d'authentification
	if (!token) {
		throw new Error("No authentication token found");
	}

	try {
		// Calcul de la date d'aujourd'hui au format ISO
		const endWeek = new Date().toISOString().split("T")[0];

		// Appel à l'API pour récupérer l'activité sur la période spécifiée
		const response = await fetch(
			`http://localhost:8000/api/user-activity?startWeek=${createdAt}&endWeek=${endWeek}`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		// Gestion des erreurs HTTP
		if (!response.ok) {
			throw new Error(`Failed to fetch user activity: ${response.status}`);
		}

		// Parsing de la réponse JSON contenant les sessions d'activité
		const userActivity: TypeUserActivity = await response.json();

		return userActivity;
	} catch (error) {
		console.error("Error fetching user activity:", error);
		throw error; // Laisse error.tsx gérer l'affichage de l'erreur
	}
}

/**
 * Calcule les statistiques globales à partir de l'historique d'activité utilisateur.
 *
 * Cette fonction agrège les données de session pour calculer les totaux cumulatifs
 * (distance, durée, calories) ainsi que le nombre de sessions et les jours d'inactivité.
 *
 * @param {TypeUserActivity} userActivity - Tableau de sessions d'activité à analyser
 * @returns {TypeUserStatistics} Un objet contenant les statistiques agrégées:
 *          - totalDistance: Distance totale parcourue (km)
 *          - totalDuration: Durée totale d'activité (minutes)
 *          - totalBurned: Calories totales brûlées
 *          - nbrSessions: Nombre total de sessions
 *          - daysOff: Nombre de jours sans activité dans la période
 *
 * @example
 * const stats = getStatUserActivity(userActivity);
 * console.log(stats.totalDistance); // Distance totale en km
 */
export function getStatUserActivity(userActivity: TypeUserActivity): TypeUserStatistics {
	// Initialisation des accumulateurs pour les statistiques
	let totalDistance = 0;
	let totalDuration = 0;
	let totalBurned = 0;
	const nbrSessions = userActivity.length;

	// Récupération des dates de début et fin
	const startDay = new Date(userActivity[0].date) ?? new Date();
	// `userActivity.at(-1)` peut retourner undefined; ce cas est géré avec l'opérateur ??
	const lastDay = new Date(userActivity.at(-1)?.date ?? startDay);

	// Calcul du nombre de jours d'inactivité entre le début et la fin de la période
	const daysOff =
		(lastDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24) -
		userActivity.length;

	// Agrégation des données de chaque session
	for (const session of userActivity) {
		totalDistance += session.distance;
		totalDuration += session.duration;
		totalBurned += session.caloriesBurned;
	}

	// Retour des statistiques calculées
	return { totalDistance, totalDuration, totalBurned, nbrSessions, daysOff };
}

/**
 * Groups an array of user activity sessions into weekly buckets.
 *
 * Sessions are processed in order (assumed chronological) and grouped
 * together as long as their date falls within the same week (Monday to Sunday).
 * A new week starts as soon as a session's date exceeds the current week's
 * end boundary.
 *
 * @param data - Array of user activity sessions, each containing a date field.
 *               Assumed to be sorted chronologically; behavior is undefined
 *               otherwise since week boundaries are computed incrementally.
 * @returns An array of week objects, each containing:
 *          - `week`: a label like "s1", "s2", ... (sequential week index)
 *          - `sessions`: the sessions belonging to that week
 *          - `startWeek`: the Monday of that week, formatted in French
 *          - `endWeek`: the Sunday of that week, formatted in French
 *          Returns an empty array if `data` is empty.
 */
/**
 * Groupe les sessions d'activité par semaines calendaires.
 *
 * Cette fonction organise un tableau de sessions d'activité en semaines (lundi à dimanche).
 * Chaque semaine reçoit un label (s1, s2, ...) et les dates formatées en français.
 * Les sessions doivent être triées chronologiquement pour un résultat correct.
 *
 * @param {TypeUserActivity | null} data - Tableau de sessions d'activité triées chronologiquement
 * @returns {TypeDatasGraph} Tableau d'objets semaine contenant:
 *          - week: label de la semaine (s1, s2, ...)
 *          - sessions: tableau des sessions de cette semaine
 *          - startWeek: date du lundi (formatée en français)
 *          - endWeek: date du dimanche (formatée en français)
 *          Retourne un tableau vide si data est null ou vide.
 *
 * @example
 * const weeks = getDataGraph(userActivity);
 * console.log(weeks[0].week);        // "s1"
 * console.log(weeks[0].startWeek);   // "23 décembre 2024"
 * console.log(weeks[0].sessions.length); // Nombre de sessions cette semaine
 */
export function getDataGraph(data: TypeUserActivity | null): TypeDatasGraph {
	// Gestion du cas limite: pas de données = pas de semaines à construire
	// Évite un crash lors de l'accès à data[0]
	if (!data || data.length === 0) {
		return [];
	}

	const weeks = [];
	let week: TypeSession[] = [];

	// Initialisation des limites de semaine basées sur la première session
	// Ces valeurs sont recalculées à chaque itération pour suivre la semaine actuelle
	let endWeek = new Date(data[0].date);
	let startWeek = new Date(data[0].date);
	let s = 1;

	// Parcours de toutes les sessions
	for (const session of data) {
		const date = new Date(session.date);

		// Si la date de la session dépasse la fin de la semaine actuelle,
		// la semaine actuelle est terminée: enregistrer et commencer une nouvelle
		if (date > endWeek) {
			weeks.push({
				week: `s${s}`,
				sessions: week,
				startWeek: frenchDate(startWeek),
				endWeek: frenchDate(endWeek),
			});
			// Réinitialisation de l'accumulateur pour la prochaine semaine
			week = [];
			s++;
		}
		// Ajout de la session à la semaine actuelle
		week.push(session);

		// Recalcul de la fin de semaine (prochain dimanche) basé sur la date actuelle
		// getDay() retourne 0 (dimanche) à 6 (samedi);
		// cette formule calcule le nombre de jours restants jusqu'au dimanche suivant
		endWeek = new Date(date);
		endWeek.setDate(date.getDate() + ((7 - date.getDay()) % 7));

		// Recalcul du début de semaine (lundi précédent) basé sur la date actuelle
		// Décale getDay() pour que lundi = 0, puis soustrait cet offset
		startWeek = new Date(date);
		startWeek.setDate(date.getDate() - ((date.getDay() + 6) % 7));
	}

	// Enregistrement de la dernière semaine accumulée
	// La boucle n'enregistre une semaine que lorsqu'une session de la *prochaine* semaine est rencontrée
	if (week.length > 0) {
		weeks.push({
			week: `s${s}`,
			sessions: week,
			startWeek: frenchDate(startWeek),
			endWeek: frenchDate(endWeek),
		});
	}

	return weeks;
}

/**
 * Formate une date au format français lisible.
 *
 * Convertit une date JavaScript en chaîne formatée selon la locale française
 * (ex: "23 décembre 2024").
 *
 * @param {Date} date - La date à formater
 * @returns {string} Date formatée au format français (jj mois.long aaaa)
 *
 * @example
 * const formatted = frenchDate(new Date(2024, 11, 23)); // "23 décembre 2024"
 */
function frenchDate(date: Date) {
	// Formatage de la date selon la locale française
	return date.toLocaleDateString("fr-FR", {
		day: "2-digit", // Jour sur 2 chiffres (01-31)
		month: "long", // Mois en toutes lettres (janvier, février, etc.)
		year: "numeric", // Année sur 4 chiffres
	});
}

/**
 * Formate une date en format court français (jj mois.court aa).
 *
 * Convertit une chaîne de date en format court lisible en français.
 * Utilise la timezone UTC pour assurer la cohérence du parsing.
 * Format: "23 déc 24"
 *
 * @param {string} data - La date au format ISO (YYYY-MM-DD) ou autre format reconnu par Date
 * @returns {string} Date formatée en court français (jj mois aa)
 *
 * @example
 * const formatted = formattedDate("2024-12-23"); // "23 déc 24"
 */
export function formattedDate(data: string): string {
	// Parsing de la chaîne de date en objet Date
	const date = new Date(data);

	// Récupération du jour en UTC (2 chiffres)
	// Utilisation des méthodes UTC pour cohérence avec le parsing UTC
	const day = String(date.getUTCDate()).padStart(2, "0");

	// Récupération du mois en français abrégé (jan, fév, mar, etc.)
	const month = date.toLocaleDateString("fr-FR", { month: "short", timeZone: "UTC" });

	// Récupération de l'année sur 2 derniers chiffres
	const year = String(date.getUTCFullYear()).slice(-2);

	// Construction et retour du format final
	const formatted = `${day} ${month} ${year}`;
	return formatted;
}
