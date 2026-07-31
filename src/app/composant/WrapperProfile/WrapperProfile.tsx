import styles from "@/app/composant/WrapperProfile/WrapperProfile.module.css";
import ProfileCard from "../ProfileCard/ProfileCard";
import { useContexteAPI, contextApi } from "@/contexts/context";

export default function WarppeProfil() {
	const { statistics } = useContexteAPI(contextApi);

	if (!statistics) {
		return <p>loading ...</p>;
	}

	return (
		<section className={styles.wrapper}>
			<article className={styles.conversationBanner}>
				<p className={styles.conversationText}>
					Posez vos questions sur votre programme, vos performances ou vos
					objectifs.
				</p>
				<a href="/coach-ai" className={styles.conversationButton}>
					Lancer une conversation
				</a>
			</article>

			{/* User profile card */}
			<article className={styles.profileCard}>
				<ProfileCard />

				<p className={styles.distanceLabel}>Distance totale parcourue</p>

				<div className={styles.distanceBadge}>
					<img src="/images/OUTLINE.png" alt="icone" />
					<span className={styles.distanceValue}>
						{parseInt(statistics.totalDistance)} km
					</span>
				</div>
			</article>
		</section>
	);
}
