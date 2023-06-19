import * as NotesApi from "../network/notes_api";
import { User } from "../models/user";
import { Button, Navbar } from "react-bootstrap";
import { BiFace } from "react-icons/bi";
import styles from "../styles/Nav.module.css";
import { Link } from "react-router-dom";

interface NavBarLoggedInViewProps {
  user: User;
  onLogoutSuccessful: () => void;
}

const NavBarLoggedInView = ({ user, onLogoutSuccessful }: NavBarLoggedInViewProps) => {
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
    <div style={{ display: "flex" }}>
      <Navbar.Text
        style={{
          marginRight: "2rem",
          color: "#4e598c",
          fontSize: "large",
          display: "flex",
          alignItems: "center",
        }}
      >
        <BiFace style={{ color: "#4e598c", marginRight: "0.5rem" }} />
        <Link
          to={`https://doodles-notes.vercel.app/u/${user.username}`}
          style={{ textDecoration: "none" }}
          className={styles.userLink}
        >
          {user.username}
        </Link>
      </Navbar.Text>
      <Button className={styles.navBtn} onClick={logout}>
        Log out
      </Button>
    </div>
  );
};

export default NavBarLoggedInView;
