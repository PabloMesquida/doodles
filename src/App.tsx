import * as NotesApi from "./network/notes_api";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { User } from "./models/user";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import NotesPage from "./pages/NotesPage";
import NotePage from "./pages/NotePage";
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
      <div className={styles.pageContainer} style={{ position: "relative" }}>
        <NavBar
          loggedInUser={loggedInUser}
          onLoginClicked={() => setShowLoginModal(true)}
          onSignUpClicked={() => setShowSignUpModal(true)}
          onLogoutSuccessful={() => setLoggedInUser(null)}
        />

        <div style={{ paddingBottom: "8rem" }}>
          <Routes>
            <Route path="/" element={<NotesPage loggedInUser={loggedInUser} />} />
            <Route path="/u/:userName" element={<NotesPage loggedInUser={loggedInUser} />} />
            <Route path="/d/:noteId" element={<NotePage loggedInUser={loggedInUser} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <div className={styles.footer} style={{ position: "absolute", bottom: "0px" }}>
          Developed by{" "}
          <a href="https://pablopx.vercel.app/" target="_blank">
            PM
          </a>
        </div>
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
