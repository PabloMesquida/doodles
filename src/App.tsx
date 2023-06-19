import * as NotesApi from "./network/notes_api";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { User } from "./models/user";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import NotesPage from "./pages/NotesPage";
import NotePage from "./pages/NotePage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import styles from "./styles/App.module.css";

function App() {
	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);

	useEffect(() => {
		async function fetchLoggedInUser() {
			try {
				const user = await NotesApi.getLoggedInUser();
				setLoggedInUser(user);
			} catch (error) {
				console.error(error);
			}
		}
		fetchLoggedInUser();
	}, []);
	return (
		<BrowserRouter>
			<div className={styles.pageContainer}>
				<NavBar
					loggedInUser={loggedInUser}
					onLoginClicked={() => setShowLoginModal(true)}
					onSignUpClicked={() => setShowSignUpModal(true)}
					onLogoutSuccessful={() => setLoggedInUser(null)}
				/>
				<div className={styles.notesPage}>
					<Routes>
						<Route
							path="/"
							element={<NotesPage loggedInUser={loggedInUser} />}
						/>
						<Route path="/privacy" element={<PrivacyPage />} />
						<Route
							path="/u/:userName"
							element={<NotesPage loggedInUser={loggedInUser} />}
						/>
						<Route
							path="/d/:noteId"
							element={<NotePage loggedInUser={loggedInUser} />}
						/>
						<Route path="*" element={<NotFoundPage />} />
					</Routes>
				</div>
				<div className={styles.footer}>Developed by PM</div>
				{showSignUpModal && (
					<SignUpModal
						onDismiss={() => setShowSignUpModal(false)}
						onSignUpSuccessful={(user) => {
							setLoggedInUser(user);
							setShowSignUpModal(false);
						}}
					/>
				)}
				{showLoginModal && (
					<LoginModal
						onDismiss={() => setShowLoginModal(false)}
						OnLoginSuccessful={(user) => {
							setLoggedInUser(user);
							setShowLoginModal(false);
						}}
					/>
				)}
			</div>
		</BrowserRouter>
	);
}

export default App;
