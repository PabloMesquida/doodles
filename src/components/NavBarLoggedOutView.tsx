import { Button } from "react-bootstrap";

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
					backgroundColor: "#4e598c",
					borderColor: "#4e598c",
					marginRight: "1rem",
				}}
			>
				Sign Up
			</Button>
			<Button
				onClick={onLoginClicked}
				style={{ backgroundColor: "#4e598c", borderColor: "#4e598c" }}
			>
				Log In
			</Button>
		</div>
	);
};

export default NavBarLoggedOutView;
