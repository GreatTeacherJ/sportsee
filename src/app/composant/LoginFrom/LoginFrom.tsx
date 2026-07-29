"use client";

import styles from "./LoginFrom.module.css";
import Cookies from "js-cookie";
import { useState } from "react";
import { responseStatus } from "@/utils/utilsAPI";
import { redirect } from "next/navigation";

export default function LoginFrom() {
	const [responseApi, setResponseAPI] = useState<string>("");

	async function handlleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();

		//on recupére le formulaire envoyer par event
		const form = new FormData(e.currentTarget);

		//on récupére les infos
		const userName = form.get("username");
		const password = form.get("password");

		//requete api pour login
		const response = await fetch("http://localhost:8000/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			//Ne pas oublier JSON.stringify() pour transformer l'objet JSON en texte
			body: JSON.stringify({
				username: userName,
				password: password,
			}),
		});

		//recupération des données en JSON avec .json()
		const data = await response.json();

		if (!response.ok) {
			setResponseAPI(responseStatus(response.status));
			return;
		}

		//on récupére le token
		const token = data.token;
		//on l'enregistre dans un cookies, 1 heure max
		Cookies.set("token", token, { expires: 0.04 });

		redirect("/profil");
	}

	return (
		<div className={styles.formCard}>
			<h1 className={styles.title}>
				Transformez
				<br />
				vos stats en résultats
			</h1>

			<h2 className={styles.subtitle}>Se connecter</h2>

			<form className={styles.form} onSubmit={handlleSubmit}>
				<div className={styles.field}>
					<label className={styles.label}>Nom d'utilisateur</label>
					<input
						id="username"
						name="username"
						className={styles.input}
						autoComplete="off"
					/>
				</div>

				<div className={styles.field}>
					<label htmlFor="password" className={styles.label}>
						Mot de passe
					</label>
					<input
						type="password"
						id="password"
						name="password"
						className={styles.input}
						autoComplete="current-password"
					/>
				</div>

				<button type="submit" className={styles.submitButton}>
					Se connecter
				</button>
				{responseApi && <p className={styles.errorText}>{responseApi}</p>}
				<a href="#" className={styles.forgotPassword}>
					Mot de passe oublié ?
				</a>
			</form>
		</div>
	);
}
