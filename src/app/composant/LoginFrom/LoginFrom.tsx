"use client";

import styles from "./LoginFrom.module.css";
import Cookies from "js-cookie";
import { useState } from "react";
import { responseStatus } from "@/utils/utilsApi";
import { useRouter } from "next/navigation";

export default function LoginFrom() {
	const [responseApi, setResponseAPI] = useState<string>("");
	const rooter = useRouter();

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();

		const form = new FormData(e.currentTarget);
		const userName = form.get("username");
		const password = form.get("password");

		//for test
		//const password = "password789";
		//const userName = "emmaleroy";

		try {
			const response = await fetch("http://localhost:8000/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: userName, password: password }),
			});

			// check response.ok BEFORE parsing JSON: avoids crashing on non-JSON error bodies
			if (!response.ok) {
				setResponseAPI(responseStatus(response.status));
				return;
			}

			// .json() can still throw if body is malformed even on a 200 response
			const data = await response.json();

			if (!data.token) {
				// defensive check: API contract violation (200 OK but no token)
				setResponseAPI("Unexpected server response");
				return;
			}

			Cookies.set("token", data.token, { expires: 0.04 });

			rooter.push(`/profil/${userName}`);

			// verify this is valid in your client component context
		} catch (error) {
			// catches network failures and JSON parsing errors
			console.error("Login failed:", error);
			setResponseAPI("Network or server error, please try again");
		}
	}

	return (
		<div className={styles.formCard}>
			<h1 className={styles.title}>
				Transformez
				<br />
				vos stats en résultats
			</h1>

			<h2 className={styles.subtitle}>Se connecter</h2>

			<form className={styles.form} onSubmit={handleSubmit}>
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
