import * as NotesApi from "../network/notes_api";
import { useState, useEffect } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Note as NoteModel } from "../models/note";
import { useParams } from "react-router-dom";
import { User } from "../models/user";
import styles from "../styles/NotesPage.module.css";
import styleUtils from "../styles/utils.module.css";
import AddEditNoteDialog from "../components/AddEditNoteDialog";
import Note from "../components/Note";
import InfiniteScroll from "react-infinite-scroll-component";

interface NotesPageProps {
  loggedInUser: User | null;
}

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  type RouteParams = {
    userName: string;
  };

  const { userName } = useParams<RouteParams>();

  useEffect(() => {
    async function loadNotes() {
      const limit = 3;
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true);
        let notes: NoteModel[];
        if (userName) {
          notes = await NotesApi.fetchUserNotes(userName);
        } else {
          notes = await NotesApi.fetchNotes({ page, limit });
        }

        setNotes((prevNotes) => [...prevNotes, ...notes]);

        if (notes.length < limit) {
          setHasMore(false);
        }
      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true);
      } finally {
        setNotesLoading(false);
      }
    }
    loadNotes();
  }, [page, userName]);

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
    <InfiniteScroll
      dataLength={notes.length}
      next={() => setPage(page + 1)}
      hasMore={hasMore}
      loader={<Spinner animation="border" variant="primary" />}
      endMessage={<p>You have reached the end of the notes.</p>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {notes.map((note) => (
          <div key={note._id}>
            <Note
              note={note}
              user={loggedInUser}
              className={styles.note}
              onNoteClicked={setNoteToEdit}
              onDeleteNoteClicked={deleteNote}
            />
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );

  return (
    <Row className="justify-content-center">
      <Col xs md="6" className="justify-content-center">
        <div className={`${styles.notesGrid}`}>
          {loggedInUser ? (
            <Button
              className={`${styleUtils.blockCenter} ${styleUtils.flexCenter} mb-4`}
              onClick={() => setShowNoteDialog(true)}
            >
              <FaPlus />
              Add new note
            </Button>
          ) : (
            "Log in "
          )}

          {notesLoading && <Spinner animation="border" variant="primary" />}
          {showNotesLoadingError && <p>Something went wrong. Please refresh the page.</p>}
          {!notesLoading && !showNotesLoadingError && (
            <>{notes.length > 0 ? notesGrid : <p>You don't have any notes yet.</p>}</>
          )}
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
          {noteToEdit && (
            <AddEditNoteDialog
              noteToEdit={noteToEdit}
              onDismiss={() => setNoteToEdit(null)}
              onNoteSaved={(updatedNote) => {
                setNotes(
                  notes.map((existingNote) =>
                    existingNote._id === updatedNote._id ? updatedNote : existingNote
                  )
                );
                setNoteToEdit(null);
              }}
            />
          )}
        </div>
      </Col>
    </Row>
  );
};

export default NotesPage;
