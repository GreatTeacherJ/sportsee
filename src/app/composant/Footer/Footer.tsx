import styles from "./Footer.module.css";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<p className={styles.copyright}>©Sportsee Tous droits réservés</p>

			<div className={styles.rightSection}>
				<a href="/conditions" className={styles.link}>
					Conditions générales
				</a>
				<a href="/contact" className={styles.link}>
					Contact
				</a>
				{/* Icon only, no text next to it here */}
				<img src="/images/Icon.png" alt="SportSee icon" className={styles.icon} />
			</div>
		</footer>
	);
}
