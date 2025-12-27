import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "./firebase"; // just to ensure firebase initializes

const storage = getStorage(); // auto-uses initialized app

export const uploadPoster = async (file: File) => {
  const posterRef = ref(storage, `posters/${Date.now()}_${file.name}`);
  await uploadBytes(posterRef, file);
  return await getDownloadURL(posterRef);
};