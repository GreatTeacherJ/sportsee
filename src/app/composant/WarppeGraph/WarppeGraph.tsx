import styles from "./WarppeGraph.module.css";

export default function WarppeGraph() {
	return (
		<section>
			<h2 className={styles.sectionTitle}>Vos dernières performances</h2>

			<div className={styles.performancesGrid}>
				{/* Chart placeholder 1 */}
				<div className={styles.chartCard}></div>

				{/* Chart placeholder 2 */}
				<div className={styles.chartCard}></div>
			</div>
		</section>
	);
}
