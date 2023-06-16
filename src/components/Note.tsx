import * as NotesApi from "../network/notes_api";
import styles from "../styles/Note.module.css";
import { Card } from "react-bootstrap";
import { Note as NoteModel } from "../models/note";
import { formDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";
import { BiFace, BiCalendar } from "react-icons/bi";
import { useEffect, useState } from "react";
import { User } from "../models/user";
import { Link } from "react-router-dom";

interface NoteProps {
	note: NoteModel;
	user: User | null;
	onNoteClicked: (note: NoteModel) => void;
	onDeleteNoteClicked: (note: NoteModel) => void;
	className?: string;
}

const Note = ({
	note,
	user,
	onNoteClicked,
	onDeleteNoteClicked,
	className,
}: NoteProps) => {
	const [userNote, setUserNote] = useState<User>();
	const { userId, title, img, createdAt, updatedAt } = note;

	let createdUpdatedText: string;

	if (updatedAt > createdAt) {
		createdUpdatedText = "Updated: " + formDate(updatedAt);
	} else {
		createdUpdatedText = formDate(createdAt);
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
		<Card
			className={`${styles.noteCard} ${className}`}
			onClick={() => onNoteClicked(note)}
		>
			<Card.Img variant="top" src={img} />
			<Card.Body>
				<Card.Title>
					<div style={{ flex: "1" }}>{title}</div>
					{user?.username === userNote?.username && (
						<div>
							<MdDelete
								className="text-muted ms-auto"
								onClick={(e: { stopPropagation: () => void }) => {
									onDeleteNoteClicked(note);
									e.stopPropagation();
								}}
							/>
						</div>
					)}
				</Card.Title>
				<Card.Text style={{ display: "flex", alignItems: "center" }}>
					<BiFace style={{ color: "darkslategrey" }} />
					<Link
						to={`https://doodles-notes.vercel.app/u/${userNote?.username}`}
						style={{ textDecoration: "none", marginLeft: "0.5rem" }}
					>
						<small className={styles.userText}>{userNote?.username}</small>
					</Link>
				</Card.Text>
				<Card.Text>
					<BiCalendar style={{ color: "darkslategrey" }} />
					<span className={styles.dateText}>{createdUpdatedText}</span>
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default Note;
