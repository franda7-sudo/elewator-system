import {
  createUserWithEmailAndPassword,
  updateEmail,
  updatePassword,
  deleteUser,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function ensureUserInAuth(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    }
    throw err;
  }
}

export async function updateAuthEmail(user, newEmail) {
  await updateEmail(user, newEmail);
}

export async function updateAuthPassword(user, newPassword) {
  await updatePassword(user, newPassword);
}

export async function deleteUserEverywhere(uid, email) {
  try {
    const adminLogin = await signInWithEmailAndPassword(
      auth,
      "superuser@elewator.pl",
      "superpassword"
    );

    const userToDelete = adminLogin.user;
    await deleteUser(userToDelete);
  } catch (err) {
    console.warn("Auth delete failed:", err.code);
  }

  await deleteDoc(doc(db, "users", uid));
}
