import * as NoteApi from "../network/notes_api";
import { useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";
import TextInputField from "./forms/TextInputField";
import { ReactP5Wrapper, P5CanvasInstance } from "react-p5-wrapper";
import { generateRandomName } from "../utils/generateRandomName";

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

  //const [canvasDataURL, setCanvasDataURL] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  console.log("Canvas REF: ", canvasRef);

  function sketch(p5: P5CanvasInstance) {
    p5.setup = () => {
      p5.createCanvas(400, 400);

      p5.background(255);
    };

    p5.draw = () => {
      p5.fill(0);
      p5.stroke(0);
      p5.strokeWeight(4);
      if (p5.mouseIsPressed === true) {
        p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
      }
    };
  }

  async function onSubmit(input: NoteInput) {
    const canvas = canvasRef.current;
    console.log("CANVAS", canvas);

    if (canvas) {
      const context = canvas.getContext("2d");
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
      const blob = new Blob([imageData as unknown as BlobPart], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob);

      console.log("IMAGE URL:", imageUrl);

      const blob2 = await (await fetch(imageUrl)).blob();
      const file = new File([blob2], "filename.png", { type: "image/png" });
      const fileRandomName = generateRandomName();
      uploadImage({ file, fileName: fileRandomName });
      console.log("FILE", file);
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

  interface UploadImageParams {
    file: File;
    fileName: string;
  }

  async function uploadImage({ file, fileName }: UploadImageParams): Promise<void> {
    const cloudName = "dq2hljnad";
    const uploadPreset = "doodles-upload";

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData: FormData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("public_id", fileName);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Archivo subido con éxito");
        // Hacer algo con la respuesta de Cloudinary
      } else {
        console.error("Error al subir archivo:", response.statusText);
      }
    } catch (error) {
      console.error("Error de red:", error);
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
        <ReactP5Wrapper sketch={sketch} />
        <canvas ref={canvasRef} style={{ display: "none" }} />
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
