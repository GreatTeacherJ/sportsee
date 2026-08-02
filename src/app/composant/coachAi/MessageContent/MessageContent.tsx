import styles from "../coachAi.module.css";

interface Response {
	text: string;
}

export default function MessageContent({ text }: Response) {
	return (
		<li className={styles.responseAi}>
			<div className={styles.messageContainer}>
				<p>Coach Ai</p>
				<div className={styles.messageContent}>
					<p>{text}</p>
				</div>
			</div>
		</li>
	);
}
