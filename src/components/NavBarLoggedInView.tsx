import * as NotesApi from "../network/notes_api";
import { User } from "../models/user";
import { Button, Navbar } from "react-bootstrap";
import { BiFace } from "react-icons/bi";

interface NavBarLoggedInViewProps {
	user: User;
	onLogoutSuccessful: () => void;
}

const NavBarLoggedInView = ({
	user,
	onLogoutSuccessful,
}: NavBarLoggedInViewProps) => {
	async function logout() {
		try {
			await NotesApi.logout();
			onLogoutSuccessful();
		} catch (error) {
			alert(error);
			console.error(error);
		}
	}

	return (
		<>
			<Navbar.Text
				style={{
					marginRight: "2rem",
					marginLeft: "0.5rem",
					color: "#4e598c",
					fontSize: "large",
				}}
			>
				<BiFace style={{ color: "#4e598c" }} /> {user.username}
			</Navbar.Text>
			<Button
				onClick={logout}
				style={{ backgroundColor: "#4e598c", borderColor: "#4e598c" }}
			>
				Log out
			</Button>
		</>
	);
};

export default NavBarLoggedInView;
