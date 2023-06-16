import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import { Link } from "react-router-dom";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import styles from "../styles/Nav.module.css";
import { hasPathAfterDomain } from "../utils/hasPathAfterDomain";

interface NavBarProps {
	loggedInUser: User | null;
	onSignUpClicked: () => void;
	onLoginClicked: () => void;
	onLogoutSuccessful: () => void;
}

const NavBar = ({
	loggedInUser,
	onSignUpClicked,
	onLoginClicked,
	onLogoutSuccessful,
}: NavBarProps) => {
	const currentUrl: string = window.location.href;
	return (
		<Navbar className={styles.navContainer} expand="sm" sticky="top">
			<Container>
				<Navbar.Brand as={Link} to="/" style={{ color: "#4e598c" }}>
					doodles
				</Navbar.Brand>
				{hasPathAfterDomain(currentUrl) && (
					<Nav>
						<Nav.Link as={Link} to="/">
							Feed
						</Nav.Link>
					</Nav>
				)}
				<Nav className="ms-auto">
					{loggedInUser ? (
						<NavBarLoggedInView
							user={loggedInUser}
							onLogoutSuccessful={onLogoutSuccessful}
						/>
					) : (
						<NavBarLoggedOutView
							onLoginClicked={onLoginClicked}
							onSignUpClicked={onSignUpClicked}
						/>
					)}
				</Nav>
			</Container>
		</Navbar>
	);
};

export default NavBar;
