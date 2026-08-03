import styles from "../coachAi.module.css";

interface Props {
	ask: string;
	voidCoach: (message: string) => void;
}

export default function ButtonTag({ ask, voidCoach }: Props) {
	return (
		<li className={styles.tag} onClick={() => voidCoach(ask)}>
			<button type="button">{ask}</button>
		</li>
	);
}
