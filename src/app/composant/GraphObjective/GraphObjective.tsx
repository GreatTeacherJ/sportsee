import styles from "./GraphObjective.module.css";
import { PieChart, Pie, Cell } from "recharts";

export default function GraphObjective() {
	const data = [
		{ name: "réalisées", value: 4 },
		{ name: "restants", value: 2 },
	];

	const COLORS = ["#2b2fef", "#b3b7f5"];

	function displayGraph() {
		return (
			<PieChart width={520} height={370}>
				<Pie
					data={data}
					dataKey="value"
					cx="50%"
					cy="50%"
					innerRadius={65}
					outerRadius={110}
					startAngle={90}
					endAngle={-270}
					// rounds the start of the first segment slightly; remove if unwanted
					paddingAngle={0}
					stroke="none"
				>
					{data.map((entry, index) => (
						<Cell key={entry.name} fill={COLORS[index]} />
					))}
				</Pie>
			</PieChart>
		);
	}
	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<span className={styles.value}>x4</span>
				<span className={styles.objective}>sur objectif de 6</span>
			</div>

			<p className={styles.subtitle}>Courses hebdomadaire réalisées</p>

			<div className={styles.chartContainer}>
				{displayGraph()}

				<span className={`${styles.label} ${styles.labelRestants}`}>
					<span className={`${styles.dot} ${styles.dotLight}`}></span>2 restants
				</span>

				<span className={`${styles.label} ${styles.labelRealisees}`}>
					<span className={`${styles.dot} ${styles.dotDark}`}></span>4 réalisées
				</span>
			</div>
		</div>
	);
}
