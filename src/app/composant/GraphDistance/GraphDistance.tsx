import styles from "./GraphDistance.module.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { contextApi, useContexteAPI } from "@/contexts/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
interface Datasession {
	session: string;
}
type Data = Datasession[];

export default function GraphDistance() {
	const [startId, setStartId] = useState(0);

	const { dataGraph } = useContexteAPI(contextApi);

	if (!dataGraph) {
		return <p>Loarding...</p>;
	}

	const data = [];

	//if dataGraph it's a not four week, we display the maxumum lenght of datagraph
	let maxDisplayweek = 4;
	if (dataGraph.length < 4) {
		maxDisplayweek = dataGraph.length;
	}

	const startDate = dataGraph[startId].startWeek;
	const endIndex = Math.min(startId + maxDisplayweek - 1, dataGraph.length - 1);
	const endDate = dataGraph[endIndex].endWeek;
	let totalDistance = 0;

	//Extract all the data for each week and add it to the data table intended for the chart.
	for (let i = startId; i < startId + maxDisplayweek; i++) {
		const week = dataGraph[i];

		if (!week) {
			continue;
		}

		const idWeek = week?.week;
		let distance = 0;

		//sum distance for all sessions
		for (const session of dataGraph[i].sessions) {
			distance += session.distance;
			totalDistance += session.distance;
		}
		//add week in the data
		data.push({ session: idWeek, distance: distance });
	}

	//Distance average
	const averageDistance = Math.round(totalDistance / maxDisplayweek);

	//function for init and display chart
	function displayGraphe(data: Data) {
		return (
			<BarChart width={450} height={400} data={data}>
				<CartesianGrid vertical={false} strokeDasharray="3 3" />

				<XAxis dataKey="session" axisLine={true} tickLine={false} />
				<YAxis axisLine={true} tickLine={false} />

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

	//function click button right
	function handdleRight() {
		if (startId === dataGraph!.length - 1) {
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

	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<h1 className={styles.title}>{averageDistance}km en moyenne</h1>

				<div className={styles.datePicker}>
					<button
						className={styles.arrowButton}
						aria-label="Semaine précédente"
						onClick={handdleLeft}
					>
						<FontAwesomeIcon
							icon={faChevronLeft}
							style={{ color: "rgb(30, 48, 80)" }}
						/>
					</button>

					<span className={styles.dateRange}>
						{startDate} - {endDate}
					</span>

					<button
						className={styles.arrowButton}
						aria-label="Semaine suivante"
						onClick={handdleRight}
					>
						<FontAwesomeIcon
							icon={faChevronRight}
							style={{ color: "rgb(30, 48, 80)" }}
						/>
					</button>
				</div>
			</div>

			<p className={styles.subtitle}>Total des kilomètres 4 dernières séssions</p>

			<div className={styles.chartContainer}>{displayGraphe(data)}</div>
		</div>
	);
}
