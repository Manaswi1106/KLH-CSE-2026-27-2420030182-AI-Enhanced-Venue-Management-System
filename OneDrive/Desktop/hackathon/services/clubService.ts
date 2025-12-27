import { db } from "./firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";

export const createClub = async (club: any) => {
  return addDoc(collection(db, "clubs"), {
    ...club,
    createdAt: Date.now(),
  });
};

export const requestJoinClub = async (clubId: string, userId: string) => {
  return updateDoc(doc(db, "clubs", clubId), {
    [`requests.${userId}`]: "pending",
  });
};

export const approveClubMember = async (clubId: string, userId: string) => {
  return updateDoc(doc(db, "clubs", clubId), {
    [`members.${userId}`]: "approved",
  });
};
