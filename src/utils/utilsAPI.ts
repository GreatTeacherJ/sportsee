//Import test data from mock.json
import data from "@/mock.json";
import type { TypeProfile, TypeStatisitcs, TypeUserInfo } from "@/types/apiTypes";

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
