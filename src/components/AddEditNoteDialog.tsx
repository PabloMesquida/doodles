import * as NoteApi from "../network/notes_api";
import { useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";
import TextInputField from "./forms/TextInputField";
import Sketch from "react-p5";
import p5Types from "p5";

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
    },
  });

  const canvasRef = useRef(null);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(400, 400).parent(canvasParentRef);
    p5.background(255);
  };

  const draw = (p5: p5Types) => {
    p5.fill(0);
    p5.stroke(0);
    p5.strokeWeight(4);
    if (p5.mouseIsPressed === true) p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
  };

  async function onSubmit(input: NoteInput) {
    if (canvasRef.current) {
      console.log("Canvas REF: ", canvasRef.current);
      // const canvas = canvasRef.current.canvas as HTMLCanvasElement;
      //const imageURL = canvas.toDataURL("image/png");

      // Aquí puedes utilizar una función para guardar la imagen, por ejemplo, enviarla al servidor o guardarla en el almacenamiento local.
      // console.log("Imagen guardada:", imageURL);
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
        <Modal.Title>{noteToEdit ? "Edit Note" : "Add Note"}</Modal.Title>
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
        <Sketch setup={setup} draw={draw} ref={canvasRef} />
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
