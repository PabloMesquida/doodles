import * as NotesApi from "../network/notes_api";
import { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Note as NoteModel } from "../models/note";
import { useParams } from "react-router-dom";
import { User } from "../models/user";
import { LogMessage } from "../components/LogMessage";
import { UserBanner } from "../components/UserBanner";
import styles from "../styles/NotesPage.module.css";
import AddEditNoteDialog from "../components/AddEditNoteDialog";
import Note from "../components/Note";
import InfiniteScroll from "react-infinite-scroll-component";

interface NotesPageProps {
  loggedInUser: User | null;
}

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  type RouteParams = {
    userName: string;
  };

  const { userName } = useParams<RouteParams>();

  async function loadNotes() {
    const limit = 3;
    try {
      setShowNotesLoadingError(false);
      let notes: NoteModel[];

      if (userName) {
        notes = await NotesApi.fetchUserNotes({ userName, page, limit });
      } else {
        notes = await NotesApi.fetchNotes({ page, limit });
      }

      if (page === 1) {
        console.log("note 1", notes);
        setNotes(notes);
      } else {
        console.log("note", notes);
        setNotes((prevNotes) => [...prevNotes, ...notes]);
      }

      if (notes.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      setShowNotesLoadingError(true);
    }
  }

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [userName]);

  useEffect(() => {
    loadNotes();
  }, [page]);

  async function deleteNote(note: NoteModel) {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const notesGrid = (
    <div>
      <InfiniteScroll
        dataLength={notes.length}
        next={() => setPage(page + 1)}
        hasMore={hasMore}
        loader={<Spinner animation="border" variant="primary" />}
        endMessage={
          <div style={{ fontSize: "small", color: "darkslategrey" }}>
            You have reached the end of the doodles.
          </div>
        }
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        {notes.map((note) => (
          <Note
            key={note._id}
            note={note}
            user={loggedInUser}
            className={styles.note}
            onDeleteNoteClicked={deleteNote}
          />
        ))}
      </InfiniteScroll>
    </div>
  );

  return (
    <div
      style={{
        alignItems: "center",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {userName ? (
        <UserBanner userName={userName} />
      ) : loggedInUser ? (
        <Button className={styles.logMessage} onClick={() => setShowNoteDialog(true)}>
          <FaPlus />
          Add new doodle!
        </Button>
      ) : (
        <LogMessage />
      )}

      {showNotesLoadingError && <p>Something went wrong. Please refresh the page.</p>}
      {!showNotesLoadingError &&
        (notes.length > 0 ? notesGrid : <p>You don't have any notes yet.</p>)}
      {showNoteDialog && (
        <>
          <AddEditNoteDialog
            onDismiss={() => setShowNoteDialog(false)}
            onNoteSaved={(newNote) => {
              setNotes([...notes, newNote]);
              setShowNoteDialog(false);
            }}
          />
        </>
      )}
    </div>
  );
};

export default NotesPage;
