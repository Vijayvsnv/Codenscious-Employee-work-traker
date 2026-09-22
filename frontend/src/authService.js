import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const registerUser = async (name, empId, phone, email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", empId), {
      name,
      emp_id: empId,
      phone,
      email,
      role: "employee",
      created_at: new Date().toISOString()
    });
    return { name, emp_id: empId, phone, email };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const loginUser = async (empId, password) => {
  try {
    const docRef = doc(db, "users", empId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("Employee ID not found. Please register first.");
    }
    const userData = docSnap.data();
    await signInWithEmailAndPassword(auth, userData.email, password);
    return userData;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};