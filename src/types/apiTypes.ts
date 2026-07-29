export interface TypeUserInfo {
	profile: TypeProfile;
	statistics: TypeStatisitcs;
}

export interface TypeProfile {
	firstName: string;
	lastName: string;
	createdAt: string;
	age: number;
	weight: number;
	height: number;
	profilePicture: string;
}

export interface TypeStatisitcs {
	totalDistance: string;
	totalSessions: number;
	totalDuration: number;
}
