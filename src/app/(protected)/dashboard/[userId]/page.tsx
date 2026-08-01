"use client";

import styles from "@/app/(protected)/dashboard/[userId]/dashboard.module.css";
import Header from "@/app/composant/header/header";
import Footer from "@/app/composant/Footer/Footer";
import WarppeProfil from "@/app/composant/WrapperProfile/WrapperProfile";
import WarpperGraph from "@/app/composant/WarppeGraph/WarppeGraph";
import WeekInfo from "@/app/composant/WeekInfo/WeekInfo";

export default function Dashboard() {
	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<Header />
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
