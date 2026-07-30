import data from "../mock.json";
import userActivity from "../AllUserActivity.json";
import type {
	TypeProfile,
	TypeStatisitcs,
	TypeUserInfo,
	TypeUserActivity,
	TypeUserStatistics,
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
