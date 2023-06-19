import * as NoteApi from "../network/notes_api";
import { Button, Form, Modal } from "react-bootstrap";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";
import { P5CanvasInstance } from "react-p5-wrapper";
import generateRandomName from "../utils/generateRandomName";
import uploadImage from "../utils/uploadImage";
import TextInputField from "./forms/TextInputField";
import Doodle from "./Doodle";

interface AddEditNoteDialogProps {
  noteToEdit?: Note;
  onDismiss: () => void;
  onNoteSaved: (note: Note) => void;
}

const AddEditNoteDialog = ({ noteToEdit, onDismiss, onNoteSaved }: AddEditNoteDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || "",
      img: noteToEdit?.img || "",
    },
  });

  async function onSubmit(input: NoteInput) {
    const canvasElement = document.getElementById("p5canvas") as P5CanvasInstance | null;

    try {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvasElement.toBlob((value: Blob | null) => resolve(value), "image/png");
      });
      if (blob) {
        const file = new File([blob], "filename.png", { type: "image/png" });
        const randomName = generateRandomName();
        input.img = `https://res.cloudinary.com/${
          import.meta.env.VITE_CLOUD_NAME
        }/image/upload/v1686591951/doodles/${randomName}.png`;
        uploadImage({ file, fileName: randomName });
      } else {
        console.error("Error al generar el Blob");
      }
    } catch (error) {
      console.error("Error al generar o cargar la imagen:", error);
    }

    try {
      let noteResponse: Note;
      if (noteToEdit) {
        noteResponse = await NoteApi.updateNote(noteToEdit._id, input);
      } else {
        noteResponse = await NoteApi.createNote(input);
      }

      onNoteSaved(noteResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>{noteToEdit ? "Edit Doodle" : "Add Doodle"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="title"
            label="Title"
            type="text"
            placeholder="Title"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.title}
          />
        </Form>
        <div style={{ textAlign: "center", width: "100%", touchAction: "none" }}>
          <Doodle />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="addEditNoteForm" disabled={isSubmitting}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditNoteDialog;
