import { db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";

export const createEvent = async (event: any) => {
  return await addDoc(collection(db, "events"), event);
};
