"use client";

import { getStatUserActivity } from "@/utils/utilsAPI";
import styles from "./WrapperStats.module.css";
import { useContexteAPI, contextApi } from "@/contexts/context";

export default function WrapperStats() {
	const { profile, userActivity } = useContexteAPI(contextApi);

	if (!profile || !userActivity) {
		return <p>Loading...</p>;
	}

	//Format the date correctly.
	const date = new Date(profile.createdAt);
	const sinceDate = new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	}).format(date);

	const { totalDistance, totalDuration, totalBurned, nbrSessions, daysOff } =
		getStatUserActivity(userActivity);

	const totalHoureDuration = Math.trunc(totalDuration / 60);
	const totalMinuteDuration = totalDuration % 60;

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
						{totalBurned}
						<span className={styles.statUnit}>cal</span>
					</p>
				</div>

				<div className={styles.statCard}>
					<p className={styles.statLabel}>Distance totale parcourue</p>
					<p className={styles.statValue}>
						{totalDistance} <span className={styles.statUnit}>km</span>
					</p>
				</div>

				<div className={styles.statCard}>
					<p className={styles.statLabel}>Nombre de jours de repos</p>
					<p className={styles.statValue}>
						{daysOff}
						<span className={styles.statUnit}>jours</span>
					</p>
				</div>

				<div className={styles.statCard}>
					<p className={styles.statLabel}>Nombre de sessions</p>
					<p className={styles.statValue}>
						{nbrSessions}
						<span className={styles.statUnit}>sessions</span>
					</p>
				</div>
			</div>
		</div>
	);
}
