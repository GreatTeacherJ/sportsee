"use client";

import styles from "./login.module.css";
import Image from "next/image";
import LoginFrom from "../composant/LoginFrom/LoginFrom";

export default function Login() {
	return (
		<div className={styles.container}>
			<div className={styles.leftPanel}>
				<div className={styles.logo}>
					<Image
						src="/images/Logo.png"
						alt="SportSee image"
						width={157}
						height={24}
					/>
				</div>
				{/*c'est là que le token est créer*/}
				<LoginFrom />
			</div>

			<div className={styles.rightPanel}>
				<div className={styles.banner}>
					Analysez vos performances en un clin d&apos;œil,
					<br />
					suivez vos progrès et atteignez vos objectifs.
				</div>
			</div>
		</div>
	);
}
