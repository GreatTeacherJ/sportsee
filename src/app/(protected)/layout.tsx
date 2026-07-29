"use client";

import { contextApi } from "@/contexts/context";
import { getApiUserInfo } from "@/utils/utilsAPI";
import type { TypeProfile, TypeStatisitcs, TypeUserInfo } from "@/types/apiTypes";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [profile, setProfile] = useState<TypeProfile | null>(null);
	const [statistics, setStatistics] = useState<TypeStatisitcs | null>(null);

	useEffect(() => {
		async function getData() {
			const { profile, statistics } = await getApiUserInfo();
			setProfile(profile);
			setStatistics(statistics);
		}

		getData();
	}, []);

	return (
		<contextApi.Provider
			value={{
				profile: profile,
				statistics: statistics,
			}}
		>
			{" "}
			<>{children}</>
		</contextApi.Provider>
	);
}
