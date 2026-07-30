import styles from "./GraphDistance.module.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const data = [
	{ session: "s1", distance: 10 },
	{ session: "s2", distance: 6 },
	{ session: "s2", distance: 7 },
];
interface Datasession {
	session: string;
}
type Data = Datasession[];

export default function GraphDistance() {
	function displayGraphe(data: Data) {
		return (
			<BarChart width={450} height={400} data={data}>
				{/* dashed grid, only horizontal lines to match the reference image */}
				<CartesianGrid vertical={false} strokeDasharray="3 3" />

				<XAxis dataKey="session" axisLine={true} tickLine={false} />
				<YAxis axisLine={true} tickLine={false} />

				{/* legend with custom dot-style icon to mimic "Km" label at bottom */}
				<Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />

				<Bar
					dataKey="distance"
					fill="#a3a8f7"
					radius={[20, 20, 20, 20]} // rounded top and bottom to get the "pill" shape
					barSize={12}
				/>
			</BarChart>
		);
	}

	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<h1 className={styles.title}>18km en moyenne</h1>

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

					<span className={styles.dateRange}>28 mai - 25 juin</span>

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

			<p className={styles.subtitle}>Total des kilomètres 4 dernières semaines</p>

			<div className={styles.chartContainer}>{displayGraphe(data)}</div>
		</div>
	);
}
