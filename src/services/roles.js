import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase.js";

export async function setUserRole(uid, role) {
  const fn = httpsCallable(functions, "setUserRole");
  return await fn({ uid, role });
}
