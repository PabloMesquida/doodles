import * as NoteApi from "../network/notes_api";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";
import TextInputField from "./forms/TextInputField";
import { ReactP5Wrapper, P5CanvasInstance } from "react-p5-wrapper";

interface AddEditNoteDialogProps {
  noteToEdit?: Note;
  onDismiss: () => void;
  onNoteSaved: (note: Note) => void;
}

const AddEditNoteDialog = ({ noteToEdit, onDismiss, onNoteSaved }: AddEditNoteDialogProps) => {
  const [canvas, setCanvas] = useState<P5CanvasInstance | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || "",
    },
  });

  //const canvasRef = useRef<HTMLDivElement>(null);

  // interface DoodleProps {
  //   cRef: React.RefObject<HTMLDivElement>;
  // }

  const Doodle = () => {
    const sketch = (p5: P5CanvasInstance) => {
      setCanvas(p5);
      p5.setup = () => {
        p5.createCanvas(400, 400);
        //p5.createCanvas(400, 400).parent(cRef.current ? cRef.current : undefined);
        //   console.log("--- CANVAS REF ---", cRef.current);

        p5.background(255);
      };

      p5.draw = () => {
        p5.fill(0);
        p5.stroke(0);
        p5.strokeWeight(25);
        if (p5.mouseIsPressed === true) {
          p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
        }
      };
    };

    return <ReactP5Wrapper sketch={sketch} />;
  };

  async function onSubmit(input: NoteInput) {
    //canvas const canvas = canvasRef.current;
    console.log("STATE-CANVAS", canvas);

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
        <Doodle />
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
