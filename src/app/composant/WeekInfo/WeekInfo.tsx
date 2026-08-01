import GraphObjective from "../GraphObjective/GraphObjective";
import styles from "./WeekInfo.module.css";

export default function WeekInfo() {
	return (
		<section className={styles.weekSection}>
			<h2 className={styles.sectionTitle}>Cette semaine</h2>
			<p className={styles.weekDates}>Du 23/06/2025 au 30/06/2025</p>

			<div className={styles.weekGrid}>
				{/* Chart placeholder 3 (donut) */}
				<div className={styles.chartCard}>
					<GraphObjective />
				</div>

				{/* Stats cards */}
				<div className={styles.statsColumn}>
					<div className={styles.statCard}>
						<p className={styles.statLabel}>Durée d'activité</p>
						<p>
							<span
								className={styles.statValue}
								style={
									{ "--colortext": "#0B23F4" } as React.CSSProperties
								}
							>
								140
							</span>
							<span
								className={styles.setUnit}
								style={
									{ "--colortext": "#B6BDFC" } as React.CSSProperties
								}
							>
								minutes
							</span>
						</p>
					</div>

					<div className={styles.statCard}>
						<p className={styles.statLabel}>Distance</p>
						<p>
							<span
								className={styles.statValue}
								style={
									{ "--colortext": "#F4320B" } as React.CSSProperties
								}
							>
								21.7
							</span>
							<span
								className={styles.setUnit}
								style={
									{ "--colortext": "#FCC1B6" } as React.CSSProperties
								}
							>
								kilométres
							</span>
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
