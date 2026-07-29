"use client";

import styles from "./WrapperStats.module.css";
import { useContexteAPI, contextApi } from "@/contexts/context";

export default function WrapperStats() {
	const { profile, statistics } = useContexteAPI(contextApi);

	if (!profile || !statistics) {
		return <p>Loading...</p>;
	}

	//Format the date correctly.
	const date = new Date(profile.createdAt);
	const sinceDate = new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	}).format(date);

	const totalHoureDuration = Math.trunc(statistics.totalDuration / 60);
	const totalMinuteDuration = statistics.totalDuration % 60;

	return (
		<div className={styles.rightColumn}>
			<h2 className={styles.statsTitle}>Vos statistiques</h2>
			<p className={styles.statsSubtitle}>depuis le {sinceDate}</p>

			<div className={styles.statsGrid}>
				<div className={styles.statCard}>
					<p className={styles.statLabel}>Temps total couru</p>
					<p className={styles.statValue}>
						{totalHoureDuration}heure
						<span className={styles.statUnit}>{totalMinuteDuration} min</span>
					</p>
				</div>

				<div className={styles.statCard}>
					<p className={styles.statLabel}>Calories brûlées</p>
					<p className={styles.statValue}>
						25000 <span className={styles.statUnit}>cal</span>
					</p>
				</div>

				<div className={styles.statCard}>
					<p className={styles.statLabel}>Distance totale parcourue</p>
					<p className={styles.statValue}>
						312 <span className={styles.statUnit}>km</span>
					</p>
				</div>

				<div className={styles.statCard}>
					<p className={styles.statLabel}>Nombre de jours de repos</p>
					<p className={styles.statValue}>
						9 <span className={styles.statUnit}>jours</span>
					</p>
				</div>

				<div className={styles.statCard}>
					<p className={styles.statLabel}>Nombre de sessions</p>
					<p className={styles.statValue}>
						41 <span className={styles.statUnit}>sessions</span>
					</p>
				</div>
			</div>
		</div>
	);
}
