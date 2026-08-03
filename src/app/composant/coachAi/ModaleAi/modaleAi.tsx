import styles from "../coachAi.module.css";
import ChatBubble from "../ChatBubble/ChatBubble";
import MessageContent from "../MessageContent/MessageContent";
import ButtonTag from "../ButtonTag/ButtonTag";
import freqientlyAsked from "../frequently_asked.json";
import { useState, useEffect, useRef } from "react";
import { contextApi, useContexteAPI } from "@/contexts/context";
import { getPrompt } from "@/utils/utilsAi";

interface TypeModaleProps {
	onClose: () => void;
}

interface Conversation {
	messageOf: "ai" | "user";
	message: string;
}

type Prompt = Conversation[];

export default function ModaleAi({ onClose }: TypeModaleProps) {
	const [conversation, setConversation] = useState<Prompt>([]);
	//pointe vers l'input area
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const { userActivity } = useContexteAPI(contextApi);
	//point vers la fin de la converstion pour scroller automatiquement
	const endOfMessagesRef = useRef<HTMLLIElement>(null);
	const [isFirstMessage, setIsFirstMessage] = useState(true);

	function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		const message = textAreaRef.current?.value;
		if (message) {
			voidCoach(message);
			if (textAreaRef.current) {
				textAreaRef.current.value = "";
			}
		}
	}

	async function voidCoach(message: string) {
		setisLoading(true);

		try {
			if (message) {
				const prompt: Conversation = { messageOf: "user", message: message };

				setConversation((conversation) => [...conversation, prompt]);
				console.log("Taille de la conversation : ", conversation.length);
				const response = await getPrompt(
					message,
					isFirstMessage ? userActivity : null,
				);

				if (isFirstMessage) {
					setIsFirstMessage(false);
				}

				if (typeof response !== "string" && !response) {
					setConversation((conversation) => [
						...conversation,
						{
							messageOf: "ai",
							message: "Une erreur est survenue veuillez réésayer...",
						},
					]);
				} else {
					setConversation((conversation) => [
						...conversation,
						{ messageOf: "ai", message: response },
					]);
				}
			} else {
				return;
			}
		} catch (error) {
			console.error("AI request failed:", error);
			setConversation((conversation) => [
				...conversation,
				{
					messageOf: "ai",
					message: "Une erreur est survenue veuillez réessayer...",
				},
			]);
		} finally {
			setisLoading(false); // guaranteed to run whether success or failure
		}
	}

	useEffect(() => {
		// scroll to the bottom marker every time a new message is added
		endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [conversation]);

	useEffect(() => {
		// lock page scroll (html + body) while modal is mounted
		const { body, documentElement } = document;
		const originalBody = body.style.overflow;
		const originalHtml = documentElement.style.overflow;
		body.style.overflow = "hidden";
		documentElement.style.overflow = "hidden";

		// cleanup: restore original overflow when modal unmounts
		return () => {
			body.style.overflow = originalBody;
			documentElement.style.overflow = originalHtml;
		};
	}, []); // empty deps: runs once on mount, cleanup runs once on unmount

	//useeffect et satte pour l'animation de l'icone
	const [dotCount, setDotCount] = useState(0);
	const [isLoading, setisLoading] = useState<boolean>(false);

	useEffect(() => {
		// If not loading, reset dots and do nothing else
		if (!isLoading) {
			setDotCount(0);
			return;
		}

		// Start an interval that cycles the dot count every 500ms
		const intervalId = setInterval(() => {
			setDotCount((prev) => (prev + 1) % 4); // loops 0 -> 1 -> 2 -> 3 -> 0
		}, 500);

		// Cleanup: clear interval when isLoading becomes false or component unmounts
		return () => clearInterval(intervalId);
	}, [isLoading]);

	return (
		<div className={styles.overlay}>
			<dialog className={styles.modaleChat} open>
				<header className={styles.headerContainer} onClick={onClose}>
					<button type="button">Fermer</button>
					<button type="button" aria-label="Fermer">
						X
					</button>
				</header>
				<section className={styles.chat} aria-label="Conversation">
					<svg
						width="16"
						height="18"
						viewBox="0 0 16 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M5.85961 4.36917C6.03709 3.79065 6.85605 3.79065 7.03353 4.36917L7.86444 7.07768C7.92418 7.27241 8.07661 7.42483 8.27134 7.48457L10.9798 8.31548C11.5584 8.49296 11.5584 9.31193 10.9798 9.4894L8.27134 10.3203C8.07661 10.3801 7.92418 10.5325 7.86444 10.7272L7.03353 13.4357C6.85605 14.0142 6.03709 14.0142 5.85961 13.4357L5.0287 10.7272C4.96896 10.5325 4.81654 10.3801 4.62181 10.3203L1.9133 9.4894C1.33478 9.31193 1.33478 8.49296 1.9133 8.31548L4.62181 7.48457C4.81654 7.42483 4.96896 7.27241 5.0287 7.07768L5.85961 4.36917Z"
							fill="#FCC1B6"
						/>
						<path
							d="M10.8274 0.728877C10.8951 0.508487 11.207 0.508487 11.2747 0.728877L11.5912 1.76069C11.614 1.83487 11.672 1.89294 11.7462 1.9157L12.778 2.23223C12.9984 2.29984 12.9984 2.61183 12.778 2.67944L11.7462 2.99598C11.672 3.01874 11.614 3.0768 11.5912 3.15099L11.2747 4.1828C11.207 4.40319 10.8951 4.40319 10.8274 4.1828L10.5109 3.15099C10.4882 3.0768 10.4301 3.01874 10.3559 2.99598L9.32409 2.67944C9.1037 2.61183 9.1037 2.29984 9.32409 2.23223L10.3559 1.9157C10.4301 1.89294 10.4882 1.83487 10.5109 1.76069L10.8274 0.728877Z"
							fill="#FCC1B6"
						/>
						<path
							d="M12.2788 11.4395C12.3718 11.1365 12.8007 11.1365 12.8937 11.4395L13.3289 12.8583C13.3602 12.9603 13.4401 13.0401 13.5421 13.0714L14.9608 13.5066C15.2639 13.5996 15.2639 14.0286 14.9608 14.1215L13.5421 14.5568C13.4401 14.5881 13.3602 14.6679 13.3289 14.7699L12.8937 16.1887C12.8007 16.4917 12.3718 16.4917 12.2788 16.1887L11.8436 14.7699C11.8123 14.6679 11.7324 14.5881 11.6304 14.5568L10.2117 14.1215C9.90864 14.0286 9.90864 13.5996 10.2117 13.5066L11.6304 13.0714C11.7324 13.0401 11.8123 12.9603 11.8436 12.8583L12.2788 11.4395Z"
							fill="#FCC1B6"
						/>
					</svg>
					{isLoading && (
						<div className={styles.dotsContainer}>
							{Array.from({ length: dotCount }).map((_, index) => (
								<span key={index} className={styles.dot} />
							))}
						</div>
					)}
					<ul className={styles.chatMessages}>
						{conversation.length < 1 && (
							<li>
								<h1>
									Posez vos questions sur votre programme, vos
									performances ou vos objectifs
								</h1>
							</li>
						)}
						{conversation.map((message, index) =>
							message.messageOf === "user" ? (
								<ChatBubble key={index} text={message.message} />
							) : (
								<MessageContent key={index} text={message.message} />
							),
						)}
						<li ref={endOfMessagesRef} />
					</ul>
				</section>
				<section className={styles.prompt}>
					<div className={styles.promptEnter}>
						<div className={styles.bassicMessage}>
							<svg
								width="12"
								height="12"
								viewBox="0 0 12 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M5.2137 0.516455C5.42495 -0.172137 6.39972 -0.172136 6.61097 0.516456L7.59997 3.74027C7.67107 3.97205 7.8525 4.15348 8.08427 4.22458L11.3081 5.21358C11.9967 5.42483 11.9967 6.3996 11.3081 6.61085L8.08427 7.59984C7.8525 7.67095 7.67107 7.85237 7.59997 8.08415L6.61097 11.308C6.39972 11.9966 5.42495 11.9966 5.2137 11.308L4.2247 8.08415C4.1536 7.85237 3.97217 7.67095 3.7404 7.59984L0.516577 6.61085C-0.172015 6.3996 -0.172014 5.42482 0.516578 5.21358L3.7404 4.22458C3.97217 4.15348 4.1536 3.97205 4.2247 3.74027L5.2137 0.516455Z"
									fill="#FCC1B6"
								/>
							</svg>
							<p>Comment puis-je vous aider ! </p>
						</div>
						<form className={styles.containerImput} onSubmit={handleSubmit}>
							<textarea
								name="prompt"
								className={styles.inputPrompt}
								placeholder="Écrivez votre message..."
								rows={2}
								aria-label="Votre message"
								ref={textAreaRef}
							></textarea>
							<button
								className={styles.validPrompt}
								type="submit"
								aria-label="Envoyer le message"
							>
								<svg
									width="12"
									height="16"
									viewBox="0 0 12 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M10.862 5.80239C10.6649 5.99742 10.3449 5.99792 10.1479 5.80239L6.00993 1.70546V15.5C6.00993 15.776 5.7839 16 5.50486 16C5.22583 16 4.99979 15.776 4.99979 15.5V1.70546L0.861834 5.8019C0.66481 5.99742 0.344792 5.99742 0.147768 5.8019C-0.049256 5.60637 -0.049256 5.28984 0.147768 5.09481L5.14781 0.144774C5.34284 -0.0482597 5.66735 -0.0482597 5.86237 0.144774L10.8624 5.09481C11.0595 5.29034 11.0595 5.60687 10.862 5.80239C11.0595 5.60687 10.6649 5.99742 10.862 5.80239Z"
										fill="white"
									/>
								</svg>
							</button>
						</form>
					</div>

					<ul className={styles.tagContainer}>
						{freqientlyAsked.map((ask, index) => (
							<ButtonTag key={index} ask={ask} voidCoach={voidCoach} />
						))}
					</ul>
				</section>
			</dialog>
		</div>
	);
}
