"use client";

import styles from "@/app/(protected)/dashboard/dashboard.module.css";
import Header from "@/app/composant/header/header";
import Footer from "@/app/composant/Footer/Footer";
import WarppeProfil from "@/app/composant/WrapperProfile/WrapperProfile";
import WarpperGraph from "@/app/composant/WarppeGraph/WarppeGraph";
import { contextApi, useContexteAPI } from "@/contexts/context";
import WeekInfo from "@/app/composant/WeekInfo/WeekInfo";

export default function Dashboard() {
	return (
		<div className={styles.page}>
			<Header />

			<main className={styles.main}>
				{/* Conversation prompt banner and header profil */}
				<WarppeProfil />

				{/* Recent performances section */}
				<WarpperGraph />

				{/* Weekly summary section */}
				<WeekInfo />
			</main>

			<Footer />
		</div>
	);
}
