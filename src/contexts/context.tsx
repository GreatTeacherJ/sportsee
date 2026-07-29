"use client";
import type { TypeProfile, TypeStatisitcs, TypeUserInfo } from "@/types/apiTypes";

import { useContext, createContext, Context } from "react";

export interface TypeContextApi {
	profile: TypeProfile | null;
	statistics: TypeStatisitcs | null;
}

export const contextApi = createContext<TypeContextApi | undefined>(undefined);

export function useContexteAPI<T>(contextToUse: Context<T | undefined>): T {
	const context = useContext(contextToUse);

	if (!context) {
		throw new Error("Dashboard must be used inside contextTeste.Provider");
	}

	return context;
}
