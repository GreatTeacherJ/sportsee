"use client";

import styles from "./header.module.css";
import Link from "next/link";
import { contextApi, useContexteAPI } from "@/contexts/context";

export default function Header() {
	const { profile } = useContexteAPI(contextApi);

	return (
		<header className={styles.header}>
			<img src="/images/Logo.png" alt="SportSee image" className={styles.logo} />
			<nav className={styles.nav}>
				<ul className={styles.navList}>
					{/* active page gets a distinct class for bold styling */}
					<Link href={`/dashboard/${profile?.firstName}`}>
						<li className={styles.navItemActive}>Dashboard</li>
					</Link>
					<Link href={"/coachai"}>
						<li className={styles.navItem}>Coach AI</li>
					</Link>
					<Link href={`/profil/${profile?.firstName}`}>
						<li className={styles.navItem}>Mon profil</li>
					</Link>
				</ul>

				<span className={styles.separator}></span>
				<Link href={"/login"}>
					<p className={styles.logout}>Se déconnecter</p>
				</Link>
			</nav>
		</header>
	);
}
