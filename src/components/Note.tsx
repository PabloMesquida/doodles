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
import { useParams } from "react-router-dom";

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

	type RouteParams = {
		noteId: string;
	};

	const { noteId } = useParams<RouteParams>();

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
		<Card className={`${styles.noteCard} ${className}`}>
			<Card.Img
				onClick={noteId !== undefined ? () => onNoteClicked(note) : undefined}
				variant="top"
				src={img}
				style={{ cursor: noteId !== undefined ? "pointer" : "" }}
			/>
			<Card.Body>
				<Card.Title style={{ display: "flex", alignItems: "center" }}>
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
				<Card.Text className={styles.cardBody}>
					<div style={{ display: "flex", alignItems: "center" }}>
						<BiFace style={{ color: "darkslategrey" }} />
						<Link
							to={`https://doodles-notes.vercel.app/u/${userNote?.username}`}
							style={{ textDecoration: "none", marginLeft: "0.5rem" }}
						>
							<small className={styles.userText}>{userNote?.username}</small>
						</Link>
					</div>
					<div style={{ display: "flex", alignItems: "center" }}>
						<BiCalendar style={{ color: "darkslategrey" }} />
						<span className={styles.dateText}>{createdUpdatedText}</span>
					</div>
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default Note;
