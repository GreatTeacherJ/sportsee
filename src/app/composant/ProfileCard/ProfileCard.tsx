import styles from "./ProfileCard.module.css";
import { useContexteAPI, contextApi } from "@/contexts/context";

export default function ProfileCard() {
	const { profile } = useContexteAPI(contextApi);

	if (!profile) {
		return <p>loading ...</p>;
	}

	const date = new Date(profile.createdAt);

	//Format the date correctly.
	const sinceDate = new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	}).format(date);

	return (
		<div className={styles.profileInfo}>
			<img
				src={profile.profilePicture}
				alt="Clara Dupont"
				className={styles.profilePhoto}
			/>
			<div>
				<p
					className={styles.profileName}
				>{`${profile.firstName} ${profile.lastName}`}</p>
				<p className={styles.profileSince}>{`Membre depuis le ${sinceDate}`}</p>
			</div>
		</div>
	);
}
