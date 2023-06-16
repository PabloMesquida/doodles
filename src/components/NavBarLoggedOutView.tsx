import { Button } from "react-bootstrap";
import styles from "../styles/Nav.module.css";

interface NavBarLoggedOutViewProps {
	onSignUpClicked: () => void;
	onLoginClicked: () => void;
}

const NavBarLoggedOutView = ({
	onSignUpClicked,
	onLoginClicked,
}: NavBarLoggedOutViewProps) => {
	return (
		<div>
			<Button
				onClick={onSignUpClicked}
				style={{
					marginRight: "1rem",
				}}
				className={styles.navBtn}
			>
				Sign Up
			</Button>
			<Button onClick={onLoginClicked} className={styles.navBtn}>
				Log In
			</Button>
		</div>
	);
};

export default NavBarLoggedOutView;
