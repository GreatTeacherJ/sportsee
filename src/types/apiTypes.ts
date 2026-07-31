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

export interface TypeSession {
	date: string;
	distance: number;
	duration: number;
	heartRate: {
		min: number;
		max: number;
		average: number;
	};
	caloriesBurned: number;
}

export type TypeUserActivity = TypeSession[];

export interface TypeUserStatistics {
	totalDistance: number;
	totalDuration: number;
	totalBurned: number;
	nbrSessions: number;
	daysOff: number;
}

export type TypeDatasGraph = TypeDataGraph[];

export interface TypeDataGraph {
	week: string; //S1, s2 s3 ....
	sessions: TypeSession[];
	startWeek: string;
	endWeek: string;
}
