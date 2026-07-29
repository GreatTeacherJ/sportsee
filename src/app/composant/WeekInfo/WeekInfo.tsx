import styles from "./WeekInfo.module.css";

export default function WeekInfo() {
	return (
		<section className={styles.weekSection}>
			<h2 className={styles.sectionTitle}>Cette semaine</h2>
			<p className={styles.weekDates}>Du 23/06/2025 au 30/06/2025</p>

			<div className={styles.weekGrid}>
				{/* Chart placeholder 3 (donut) */}
				<div className={styles.chartCard}></div>

				{/* Stats cards */}
				<div className={styles.statsColumn}>
					<div className={styles.statCard}>
						<p className={styles.statLabel}>Durée d'activité</p>
						<p className={styles.statValue}>140 minutes</p>
					</div>

					<div className={styles.statCard}>
						<p className={styles.statLabel}>Distance</p>
						<p className={styles.statValue}>21.7 kilomètres</p>
					</div>
				</div>
			</div>
		</section>
	);
}
