interface UploadImageParams {
  file: File;
  fileName: string;
}

export default async function uploadImage({ file, fileName }: UploadImageParams): Promise<void> {
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
    } else {
      console.error("Error al subir archivo:", response.statusText);
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
}
