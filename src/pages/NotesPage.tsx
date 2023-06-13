import { Container } from "react-bootstrap";
//import { User } from "../models/user";
import styles from "../styles/NotesPage.module.css";
import NotesPageLoggedInView from "../components/NotesPageLoggedInView";
// import NotesPageLoggedOutView from "../components/NotesPageLoggedOutView";

// interface NotesPageProps {
//   loggedInUser: User | null;
// }

const NotesPage = () => {
  return (
    <Container className={styles.notesPage}>
      <>
        <NotesPageLoggedInView />
      </>
    </Container>
  );
};

export default NotesPage;
