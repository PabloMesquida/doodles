import { BiFace } from "react-icons/bi";
import styles from "../styles/NotesPage.module.css";

export const UserBanner = (userName: string) => {
	return (
		<div className={styles.logMessage}>
			<BiFace size={64} />
			<span>{userName} doodles</span>
		</div>
	);
};
