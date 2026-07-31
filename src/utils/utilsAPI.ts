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
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

// Get a message corresponding to the response status
export function responseStatus(responseStatus: number): string {
	//on gére selon le status
	switch (responseStatus) {
		case 403:
			return "Identification impossible";

		case 400:
			return "Nom d'utilisateur ou mot de passe incorecte";

		case 401:
			return "Identification impossible";

		case 404:
			return "Ressource non trouvées";

		case 500:
			return "Une érreur serveur est intérvenue, veuillez réésayer plus tard";

		default:
			return "Une érreur inconue est intérvenue, veuillez réésayer plus tard";
	}
}

//Retrieving user information via the API
export async function getApiUserInfo(): Promise<TypeUserInfo> {
	const token = Cookies.get("token");

	// no token means the user isn't authenticated: no point calling the API
	if (!token) {
		throw new Error("No authentication token found");
	}

	try {
		const response = await fetch("http://localhost:8000/api/user-info", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			// covers expired/invalid token (401), forbidden (403), server errors (5xx)
			throw new Error(`Failed to fetch user info: ${response.status}`);
		}

		const userInfo: TypeUserInfo = await response.json();

		const profile: TypeProfile = userInfo.profile;
		const statistics: TypeStatisitcs = userInfo.statistics;

		return { profile, statistics };
	} catch (error) {
		console.error("Error fetching user info:", error);
		throw error; // let error.tsx handle the display
	}
}

export async function getApiImage(filename: string | null): Promise<string | null> {
	if (!filename) {
		return null;
	}
	console.log("nom du fichier", filename);
	try {
		const response = await fetch(filename);

		// fetch doesn't throw on HTTP error status (404, 500...), only on network failure
		// so we must check response.ok manually
		if (!response.ok) {
			throw new Error(
				`Failed to fetch image: ${response.status} ${response.statusText}`,
			);
		}

		const blob = await response.blob();

		// ATTENTION: Don't forget to delete the ObjectUrl upon logout
		// otherwise, there is a risk of a memory leak
		const avatarUrl = URL.createObjectURL(blob);

		return avatarUrl;
	} catch (error) {
		// Log for debugging: distinguish network error vs HTTP error vs blob parsing error
		console.error(`Error loading avatar image "${filename}":`, error);

		// Return a fallback so calling code doesn't break (e.g. default avatar path)
		return "/images/avatar.png";
	}
}

export async function getApiUserActivity(createdAt: string): Promise<TypeUserActivity> {
	const token = Cookies.get("token");

	// no token means the user isn't authenticated: no point calling the API
	if (!token) {
		throw new Error("No authentication token found");
	}

	try {
		// today's date
		const endWeek = new Date().toISOString().split("T")[0];

		const response = await fetch(
			`http://localhost:8000/api/user-activity?startWeek=${createdAt}&endWeek=${endWeek}`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch user activity: ${response.status}`);
		}

		const userActivity: TypeUserActivity = await response.json();

		return userActivity;
	} catch (error) {
		console.error("Error fetching user activity:", error);
		throw error; // let error.tsx handle the display
	}
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
