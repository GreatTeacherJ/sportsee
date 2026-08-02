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
import { contextApi, useContexteAPI } from "@/contexts/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { formattedDate } from "@/utils/utilsApi";

interface DataBpm {
	day: string;
	min: number;
	max: number;
	avg: number;
}

type DataGraph = DataBpm[];

export default function GraphBpm() {
	const [startId, setStartId] = useState(0);
	const { userActivity } = useContexteAPI(contextApi);

	if (!userActivity) {
		return <p>Loarding...</p>;
	}

	const data = [];

	//if userActivity  it's a not four week, we display the maxumum lenght of userActivity
	let maxDisplayweek = 7;
	if (userActivity.length < 7) {
		maxDisplayweek = userActivity.length;
	}

	const startDate = userActivity[startId].date;
	const endIndex = Math.min(startId + maxDisplayweek - 1, userActivity.length - 1);
	const endDate = userActivity[endIndex].date;
	let bpm = 0;
	//Extract all the data for each week and add it to the data table intended for the chart.
	for (let i = startId; i < startId + maxDisplayweek; i++) {
		const session = userActivity[i];

		if (!session) {
			continue;
		}

		const dateString = userActivity[i].date;
		const date = new Date(dateString);

		// 'short' gives abbreviated form, but length varies by locale (not guaranteed to be 3 chars)
		const dayShort = date.toLocaleDateString("fr-FR", { weekday: "short" });
		bpm += userActivity[i].heartRate.min + userActivity[i].heartRate.max;
		data.push({
			day: dayShort,
			min: userActivity[i].heartRate.min,
			max: userActivity[i].heartRate.max,
			avg: userActivity[i].heartRate.average,
		});
	}
	const averageBpm = Math.round(bpm / (maxDisplayweek * 2));
	//function click button right
	function handdleRight() {
		if (startId === userActivity!.length - 1) {
			return;
		}

		setStartId((startId) => startId + 1);
	}

	//function click button left
	function handdleLeft() {
		if (startId < 1) {
			return;
		}

		setStartId((startId) => startId - 1);
	}
	function displayGraph(data: DataGraph) {
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
					<h1 className={styles.title}>{averageBpm}BPM</h1>
					<p className={styles.subtitle}>
						FrÃ©quence cardiaque moyenne des 7 dÃ©rniÃ©re sÃ©ssions
					</p>
				</div>

				<div className={styles.datePicker}>
					<button
						className={styles.arrowButton}
						aria-label="Session prÃ©cÃ©dente"
						onClick={handdleLeft}
					>
						<FontAwesomeIcon
							icon={faChevronLeft}
							style={{ color: "rgb(30, 48, 80)" }}
						/>
					</button>

					<span className={styles.dateRange}>
						{formattedDate(startDate)}- {formattedDate(endDate)}
					</span>

					<button
						className={styles.arrowButton}
						aria-label="Session suivante"
						onClick={handdleRight}
					>
						<FontAwesomeIcon
							icon={faChevronRight}
							style={{ color: "rgb(30, 48, 80)" }}
						/>
					</button>
				</div>
			</div>

			<div className={styles.chartContainer}>{displayGraph(data)}</div>

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
					<span>Moyenne BPM</span>
				</div>
			</div>
		</div>
	);
}
