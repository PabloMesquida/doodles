interface UploadImageParams {
  file: File;
  fileName: string;
}

export default async function uploadImage({ file, fileName }: UploadImageParams): Promise<void> {
  const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/upload`;
  const formData: FormData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
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
