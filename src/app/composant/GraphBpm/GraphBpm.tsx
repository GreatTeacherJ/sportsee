import styles from "./GraphBpm.module.css";
import {
	ComposedChart,
	Bar,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
} from "recharts";

export default function GraphBpm() {
	const data = [
		{ day: "Lun", min: 139, max: 175, avg: 167 },
		{ day: "Mar", min: 141, max: 180, avg: 170 },
		{ day: "Mer", min: 145, max: 186, avg: 173 },
		{ day: "Jeu", min: 141, max: 178, avg: 167 },
		{ day: "Ven", min: 137, max: 170, avg: 170 },
		{ day: "Sam", min: 145, max: 165, avg: 157 },
		{ day: "Dim", min: 137, max: 180, avg: 168 },
	];

	function displayGraph() {
		return (
			<ResponsiveContainer width="100%" height={320}>
				<ComposedChart
					data={data}
					margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
				>
					<CartesianGrid vertical={false} stroke="#eee" strokeDasharray="3 3" />

					<XAxis
						dataKey="day"
						axisLine={false}
						tickLine={false}
						tick={{ fill: "#6b7280", fontSize: 13 }}
					/>

					<YAxis
						domain={[130, 187]}
						ticks={[130, 145, 160, 187]}
						axisLine={false}
						tickLine={false}
						tick={{ fill: "#6b7280", fontSize: 12 }}
					/>

					{/* min bar, light pink, placed behind */}
					<Bar
						dataKey="min"
						barSize={14}
						radius={[8, 8, 8, 8]}
						fill="#f9c9be"
					/>

					{/* max bar, red, offset to appear next to min bar */}
					<Bar
						dataKey="max"
						barSize={14}
						radius={[8, 8, 8, 8]}
						fill="#ea4b2a"
					/>

					{/* average line with curved interpolation and custom blue dots */}
					<Line
						type="monotone"
						dataKey="avg"
						stroke="#c7cbf5"
						strokeWidth={2}
						activeDot={false}
					/>
				</ComposedChart>
			</ResponsiveContainer>
		);
	}

	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<div className={styles.titleGroup}>
					<h1 className={styles.title}>163 BPM</h1>
					<p className={styles.subtitle}>Fréquence cardiaque moyenne</p>
				</div>

				<div className={styles.datePicker}>
					<button
						className={styles.arrowButton}
						aria-label="Semaine précédente"
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
							<path
								d="M15 18l-6-6 6-6"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>

					<span className={styles.dateRange}>28 mai - 04 juin</span>

					<button className={styles.arrowButton} aria-label="Semaine suivante">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
							<path
								d="M9 18l6-6-6-6"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				</div>
			</div>

			<div className={styles.chartContainer}>{displayGraph()}</div>

			<div className={styles.legend}>
				<div className={styles.legendItem}>
					<span className={`${styles.dot} ${styles.dotMin}`}></span>
					<span>Min</span>
				</div>
				<div className={styles.legendItem}>
					<span className={`${styles.dot} ${styles.dotMax}`}></span>
					<span>Max BPM</span>
				</div>
				<div className={styles.legendItem}>
					<span className={`${styles.dot} ${styles.dotAvg}`}></span>
					<span>Max BPM</span>
				</div>
			</div>
		</div>
	);
}
