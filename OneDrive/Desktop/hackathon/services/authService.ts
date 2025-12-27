import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const signup = async (
  email: string,
  password: string,
  role: "student" | "admin"
) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  // Save user role in Firestore
  await setDoc(doc(db, "users", res.user.uid), {
    email,
    role,
    createdAt: Date.now(),
  });

  return res.user;
};

export const login = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
};
