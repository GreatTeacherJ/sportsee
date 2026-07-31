import data from "../mock.json";
import userActivity from "../AllUserActivity.json";
import type {
	TypeProfile,
	TypeStatisitcs,
	TypeUserInfo,
	TypeUserActivity,
	TypeUserStatistics,
	TypeDatasGraph,
	TypeSession,
} from "@/types/apiTypes";

// Get a message corresponding to the response status
export function responseStatus(responseStatus: number): string {
	//on gére selon le status
	switch (responseStatus) {
		case 200:
			return "";

			break;
		case 400:
			return "Nom d'utilisateur ou mot de passe incorecte";
			break;
		case 401 | 403:
			return "Identification impossable";
			break;
		case 404:
			return "Ressource non trouvées";
			break;
		case 500:
			return "Une érreur serveur est intérvenue, veuillez réésayer plus tard";
			break;

		default:
			return "Une érreur inconue est intérvenue, veuillez réésayer plus tard";
			break;
	}
}

//Retrieving user information via the API
export async function getApiUserInfo(): Promise<TypeUserInfo> {
	const userInfo: TypeUserInfo = data["api/user-info"];

	const profile: TypeProfile = userInfo.profile;

	const statistics: TypeStatisitcs = userInfo.statistics;

	return { profile, statistics };
}

export async function getApiUserActivity(): Promise<TypeUserActivity> {
	return userActivity;
}

export function getStatUserActivity(userActivity: TypeUserActivity): TypeUserStatistics {
	let totalDistance = 0;

	let totalDuration = 0;
	let totalBurned = 0;
	const nbrSessions = userActivity.length;

	const startDay = new Date(userActivity[0].date) ?? new Date();
	//`userActivity.at(-1)` can return `undefined`; we have handled this case and return the startDay.
	const lastDay = new Date(userActivity.at(-1)?.date ?? startDay);

	const daysOff =
		(lastDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24) -
		userActivity.length;
	console.log(daysOff);

	for (const session of userActivity) {
		totalDistance += session.distance;
		totalDuration += session.duration;
		totalBurned += session.caloriesBurned;
	}
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
export function getDataGraph(data: TypeUserActivity | null): TypeDatasGraph {
	// Edge case: no sessions means no weeks to build.
	// Avoids crashing on data[0] below when data is empty.
	if (!data || data.length === 0) {
		return [];
	}

	const weeks = [];
	let week: TypeSession[] = [];

	// Initialize week boundaries based on the first session's date.
	// These get recalculated on every iteration to track the current week.
	let endWeek = new Date(data[0].date);
	let startWeek = new Date(data[0].date);
	let s = 1;

	for (const session of data) {
		const date = new Date(session.date);

		// If the current session's date falls after the current week's end,
		// the current week is complete: push it and start a new one.
		if (date > endWeek) {
			weeks.push({
				week: `s${s}`,
				sessions: week,
				startWeek: frenchDate(startWeek),
				endWeek: frenchDate(endWeek),
			});
			// Reset the accumulator for the next week.
			week = [];
			s++;
		}
		week.push(session);

		// Recompute the end of the week (next Sunday) based on the current date.
		// getDay() returns 0 (Sunday) to 6 (Saturday); this formula finds
		// how many days remain until the upcoming Sunday.
		endWeek = new Date(date);
		endWeek.setDate(date.getDate() + ((7 - date.getDay()) % 7));

		// Recompute the start of the week (previous Monday) based on the current date.
		// Shifts getDay() so Monday = 0, then subtracts that offset.
		startWeek = new Date(date);
		startWeek.setDate(date.getDate() - ((date.getDay() + 6) % 7));
	}

	// Push the last accumulated week, since the loop only pushes
	// a week when a session from the *next* week is encountered.
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

function frenchDate(date: Date) {
	return date.toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

export function formattedDate(data: string): string {
	const date = new Date(data);

	// getUTCDate/Month/FullYear to stay consistent with UTC parsing (see previous point)
	const day = String(date.getUTCDate()).padStart(2, "0");
	const month = date.toLocaleDateString("fr-FR", { month: "short", timeZone: "UTC" });
	const year = String(date.getUTCFullYear()).slice(-2);

	const formatted = `${day} ${month} ${year}`;
	return formatted;
}
