export async function uploadImageToCloudinary(file) {
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;
  const url = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);

  const res = await fetch(url, { method: "POST", body: fd });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `Error al subir imagen a Cloudinary: ${res.status} ${errText}`
    );
  }
  const data = await res.json();
  return data.secure_url; // URL que se guardará en la base de datos
}
