import { MdDraw } from "react-icons/md";
import styles from "../styles/NotesPage.module.css";

export const LogMessage = () => {
	const phrases = [
		"Hop in and log in to share your awesome doodles!",
		"Hey there! Sign in to show off your cool doodles!",
		"Time to log in and unleash your doodling magic!",
		"Ready to join the fun? Login and share your amazing doodles!",
		"Hey, doodle enthusiast! Sign in and let your creativity shine!",
		"Login and let the world see your fantastic doodles!",
		"Calling all doodlers! Sign in and share your masterpieces!",
		"Get doodlin'! Log in and display your doodle awesomeness!",
		"Login and be part of the doodle-loving community!",
		"Sign in and let your doodles spread some smiles!",
	];

	const randomIndex = Math.floor(Math.random() * phrases.length);
	const randomPhrase = phrases[randomIndex];

	return (
		<div className={styles.logMessage}>
			<MdDraw />
			<p>{randomPhrase}</p>
		</div>
	);
};
