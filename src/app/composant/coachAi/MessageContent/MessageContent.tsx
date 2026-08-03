import styles from "../coachAi.module.css";
import ReactMarkdown from "react-markdown";

//<ReactMarkdown>{message.message}</ReactMarkdown>

interface Response {
	text: string;
}

export default function MessageContent({ text }: Response) {
	// in MessageContent.tsx, temporarily

	return (
		<li className={styles.responseAi}>
			<div className={styles.messageContainer}>
				<p>Coach Ai</p>
				<div className={styles.messageContent}>
					<ReactMarkdown>{text}</ReactMarkdown>
				</div>
			</div>
		</li>
	);
}
