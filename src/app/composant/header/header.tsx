"use client";

import styles from "./header.module.css";
import Image from "next/image";
import Link from "next/link";
import { contextApi, useContexteAPI } from "@/contexts/context";
import { usePathname } from "next/navigation";

export default function Header() {
	const { profile, avatarUrl } = useContexteAPI(contextApi);

	let idActive = 0;
	const pathname = usePathname();

	switch (true) {
		case pathname.startsWith("/dashboard"):
			idActive = 1;
			break;
		case pathname.startsWith("/coachia"):
			idActive = 2;
			break;
		case pathname.startsWith("/profil"):
			idActive = 3;
			break;
		default:
			idActive = 0;
			break;
	}

	function handdleDisconnect() {
		if (avatarUrl) {
			URL.revokeObjectURL(avatarUrl);
		}
	}

	return (
		<header className={styles.header}>
			<Image
				src="/images/Logo.png"
				alt="SportSee image"
				className={styles.logo}
				width={157}
				height={24}
			/>
			<nav className={styles.nav}>
				<ul className={styles.navList}>
					{/* active page gets a distinct class for bold styling */}
					<Link href={`/dashboard/${profile?.firstName}`}>
						<span
							className={
								idActive === 1 ? styles.navItemActive : styles.navItem
							}
						>
							Dashboard
						</span>
					</Link>
					<Link href={"/coachai"}>
						<span
							className={
								idActive === 2 ? styles.navItemActive : styles.navItem
							}
						>
							Coach AI
						</span>
					</Link>
					<Link href={`/profil/${profile?.firstName}`}>
						<span
							className={
								idActive === 3 ? styles.navItemActive : styles.navItem
							}
						>
							Mon profil
						</span>
					</Link>
				</ul>

				<span className={styles.separator}></span>
				<Link href={"/login"} onClick={handdleDisconnect}>
					<p className={styles.logout}>Se déconnecter</p>
				</Link>
			</nav>
		</header>
	);
}
