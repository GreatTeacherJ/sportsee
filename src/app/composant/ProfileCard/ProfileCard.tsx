import styles from "./ProfileCard.module.css";
import { useContexteAPI, contextApi } from "@/contexts/context";

export default function ProfileCard() {
	const { profile, avatarUrl } = useContexteAPI(contextApi);

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
				src={avatarUrl ? avatarUrl : "/images/avatar.png"}
				alt={`${profile.firstName} ${profile.lastName}`}
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
