import styles from "./profil.module.css";
import Header from "@/app/composant/header/header";
import Footer from "@/app/composant/Footer/Footer";
import InfoProfil from "@/app/composant/InfoProfil/InfoProfil";
import WrapperStats from "@/app/composant/WrapperStats/WrapperStats";

export default function Profil() {
	return (
		<div className={styles.page}>
			<div className={styles.main}>
				<Header />
				<main className={styles.container}>
					{/* Left column: profile photo + info */}
					<InfoProfil />

					{/* Right column: statistics */}
					<WrapperStats />
				</main>
			</div>
			<Footer />
		</div>
	);
}
