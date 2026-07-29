"use client";

import styles from "./InfoProfil.module.css";
import { useContexteAPI, contextApi } from "@/contexts/context";
import ProfileCard from "../ProfileCard/ProfileCard";

export default function InfoProfil() {
	const { profile } = useContexteAPI(contextApi);

	if (!profile) {
		return <p>loading ...</p>;
	}

	return (
		<div className={styles.leftColumn}>
			<ProfileCard />

			<section className={styles.infoCard}>
				<h2 className={styles.infoTitle}>Votre profil</h2>
				<hr className={styles.divider} />

				<ul className={styles.infoList}>
					<li>Âge : {profile.age}</li>
					<li>Genre : Non Renseigné</li>
					<li>Taille : {profile.height}</li>
					<li>Poids : {`${profile.weight}kg`}</li>
				</ul>
			</section>
		</div>
	);
}
