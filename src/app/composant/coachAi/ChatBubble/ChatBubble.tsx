import styles from "../coachAi.module.css";

interface text {
	text: string;
}

export default function ChatBubble({ text }: text) {
	return (
		<li className={styles.chatContainer}>
			<div className={styles.chatBubble}>
				<p>{text}</p>
			</div>
			<img src="/images/avatar.png" alt="" />
		</li>
	);
}
