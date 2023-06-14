import * as NotesApi from "../network/notes_api";
import styles from "../styles/Note.module.css";
import styleUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { Note as NoteModel } from "../models/note";
import { formDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";
import { RiUserSmileLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { User } from "../models/user";

interface NoteProps {
  note: NoteModel;
  onNoteClicked: (note: NoteModel) => void;
  onDeleteNoteClicked: (note: NoteModel) => void;
  className?: string;
}

const Note = ({ note, onNoteClicked, onDeleteNoteClicked, className }: NoteProps) => {
  const [userNote, setUserNote] = useState<User>();
  const { userId, title, img, createdAt, updatedAt } = note;

  let createdUpdatedText: string;

  if (updatedAt > createdAt) {
    createdUpdatedText = "Updated: " + formDate(updatedAt);
  } else {
    createdUpdatedText = "Created: " + formDate(createdAt);
  }

  useEffect(() => {
    async function loadUserNote() {
      try {
        const user = await NotesApi.fetchNoteUser(userId);
        setUserNote(user);
      } catch (error) {
        console.error(error);
      }
    }
    loadUserNote();
  }, [userId]);

  return (
    <Card className={`${styles.noteCard} ${className}`} onClick={() => onNoteClicked(note)}>
      <Card.Body className={styles.cardBody}>
        <div>
          <RiUserSmileLine />
          <p className="card-text">
            <small className="text-muted">{userNote?.username}</small>
          </p>
        </div>
        <Card.Title className={styleUtils.flexCenter}>
          {title}
          <MdDelete
            className="text-muted ms-auto"
            onClick={(e: { stopPropagation: () => void }) => {
              onDeleteNoteClicked(note);
              e.stopPropagation();
            }}
          />
        </Card.Title>
        <img src={img} className="img-fluid" />
      </Card.Body>
      <Card.Footer className="text-muted">{createdUpdatedText}</Card.Footer>
    </Card>
  );
};

export default Note;
