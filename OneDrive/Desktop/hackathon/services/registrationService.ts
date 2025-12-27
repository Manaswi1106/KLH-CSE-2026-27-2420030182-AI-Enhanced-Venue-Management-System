import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/* REGISTER EVENT */
export const registerForEvent = async (
  eventId: string,
  userId: string
) => {
  await addDoc(collection(db, "registrations"), {
    eventId,
    userId,
    checkedIn: false,
    createdAt: serverTimestamp(),
  });
};


/* GET REGISTRATIONS FOR LOGGED IN USER */
export const getMyRegistrations = async (userId: string) => {
  const q = query(
    collection(db, "registrations"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
