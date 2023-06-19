import * as NotesApi from "../network/notes_api";
import { useState, useEffect } from "react";
import { User } from "../models/user";
import { Note as NoteModel } from "../models/note";
import { useParams } from "react-router-dom";
import styles from "../styles/NotesPage.module.css";
import Note from "../components/Note";

interface NotePageProps {
	loggedInUser: User | null;
}

const NotePage = ({ loggedInUser }: NotePageProps) => {
	const [note, setNote] = useState<NoteModel | null>(null);
	const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

	type RouteParams = {
		noteId: string;
	};

	const { noteId } = useParams<RouteParams>();

	useEffect(() => {
		async function loadNote() {
			try {
				if (noteId) {
					const note = await NotesApi.fetchNote(noteId);
					setShowNotesLoadingError(false);
					setNote(note);
				} else {
					setShowNotesLoadingError(true);
				}
			} catch (error) {
				console.error(error);
				setShowNotesLoadingError(true);
			}
		}
		loadNote();
	}, []);

	async function deleteNote(note: NoteModel) {
		try {
			await NotesApi.deleteNote(note._id);
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	return (
		<div>
			{showNotesLoadingError && (
				<p>Something went wrong. Please refresh the page.</p>
			)}
			{!showNotesLoadingError && note && (
				<Note
					key={note._id}
					note={note}
					user={loggedInUser}
					className={styles.note}
					onNoteClicked={setNote}
					onDeleteNoteClicked={deleteNote}
				/>
			)}
		</div>
	);
};

export default NotePage;
