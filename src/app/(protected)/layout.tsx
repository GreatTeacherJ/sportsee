"use client";

import { contextApi } from "@/contexts/context";
import { getApiUserInfo, getApiUserActivity } from "@/utils/utilsAPI";
import type { TypeProfile, TypeStatisitcs, TypeUserActivity } from "@/types/apiTypes";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [profile, setProfile] = useState<TypeProfile | null>(null);
	const [statistics, setStatistics] = useState<TypeStatisitcs | null>(null);
	const [userActivity, setUserActivity] = useState<TypeUserActivity | null>(null);

	useEffect(() => {
		async function getData() {
			const { profile, statistics } = await getApiUserInfo();
			setProfile(profile);
			setStatistics(statistics);
			const userActivity = await getApiUserActivity();
			setUserActivity(userActivity);
		}

		getData();
	}, []);

	return (
		<contextApi.Provider
			value={{
				profile: profile,
				statistics: statistics,
				userActivity: userActivity,
			}}
		>
			{" "}
			<>{children}</>
		</contextApi.Provider>
	);
}
