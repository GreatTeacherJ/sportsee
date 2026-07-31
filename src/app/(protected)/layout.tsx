"use client";

import { contextApi } from "@/contexts/context";
import {
	getApiUserInfo,
	getApiUserActivity,
	getDataGraph,
	getApiImage,
} from "@/utils/utilsAPI";
import type {
	TypeProfile,
	TypeStatisitcs,
	TypeUserActivity,
	TypeDatasGraph,
} from "@/types/apiTypes";
import { useEffect, useState, useMemo } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [profile, setProfile] = useState<TypeProfile | null>(null);
	const [statistics, setStatistics] = useState<TypeStatisitcs | null>(null);
	const [userActivity, setUserActivity] = useState<TypeUserActivity | null>(null);
	const [dataGraph, setDataGraph] = useState<TypeDatasGraph | null>(null);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	useEffect(() => {
		async function getData() {
			const { profile, statistics } = await getApiUserInfo();
			setProfile(profile);
			setStatistics(statistics);
			const userActivity = await getApiUserActivity(profile.createdAt);
			setUserActivity(userActivity);
			setDataGraph(getDataGraph(userActivity));
			const avatarUrl = await getApiImage(profile.profilePicture);
			setAvatarUrl(avatarUrl);
		}

		getData();
	}, []);

	const contextValue = useMemo(
		() => ({
			profile,
			statistics,
			userActivity,
			dataGraph,
			avatarUrl,
		}),
		[profile, statistics, userActivity, dataGraph],
	);

	return (
		<contextApi.Provider value={contextValue}>
			<>{children}</>
		</contextApi.Provider>
	);
}
