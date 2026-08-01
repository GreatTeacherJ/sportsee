import styles from "./WarppeGraph.module.css";
import GraphDistance from "../GraphDistance/GraphDistance";
import GraphBpm from "../GraphBpm/GraphBpm";

export default function WarppeGraph() {
	return (
		<section>
			<h2 className={styles.sectionTitle}>Vos dernières performances</h2>

			<div className={styles.performancesGrid}>
				{/* Chart placeholder 1 */}
				<div className={styles.chartCard}>
					<GraphDistance />
				</div>

				{/* Chart placeholder 2 */}
				<div className={styles.chartCard}>
					<GraphBpm />
				</div>
			</div>
		</section>
	);
}
