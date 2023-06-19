import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import styles from "../styles/Nav.module.css";

interface NavBarProps {
	loggedInUser: User | null;
	onSignUpClicked: () => void;
	onLoginClicked: () => void;
	onLogoutSuccessful: () => void;
	hasPath: boolean;
}

const NavBar = ({
	loggedInUser,
	onSignUpClicked,
	onLoginClicked,
	onLogoutSuccessful,
	hasPath,
}: NavBarProps) => {
	useEffect(() => {
		console.log("nav", hasPath);
	}, [hasPath]);

	return (
		<Navbar className={styles.navContainer} expand="sm" sticky="top">
			<Container>
				<Navbar.Brand as={Link} to="/" style={{ color: "#4e598c" }}>
					doodles
				</Navbar.Brand>
				{hasPath && (
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
