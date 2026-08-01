"use client";

import styles from "./login.module.css";
import LoginFrom from "../composant/LoginFrom/LoginFrom";
import { useContexteAPI, contextApi } from "@/contexts/context";

export default function Login() {
	return (
		<div className={styles.container}>
			<div className={styles.leftPanel}>
				<div className={styles.logo}>
					<img src="/images/Logo.png" alt="SportSee image" />
				</div>
				{/*c'est là que le token est créer*/}
				<LoginFrom />
			</div>

			<div className={styles.rightPanel}>
				<div className={styles.banner}>
					Analysez vos performances en un clin d'œil,
					<br />
					suivez vos progrès et atteignez vos objectifs.
				</div>
			</div>
		</div>
	);
}
