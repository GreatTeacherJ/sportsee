import styles from "../coachAi.module.css";

interface Props {
	ask: string;
}

export default function ButtonTag({ ask }: Props) {
	return (
		<li className={styles.tag}>
			<button type="button">{ask}</button>
		</li>
	);
}
