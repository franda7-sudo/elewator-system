import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

// MIGRACJA parameters → groups
export async function migrateParametersToGroups(grainId) {
  console.log("Migracja START:", grainId);

  const paramsRef = collection(db, "grains", grainId, "parameters");
  const snap = await getDocs(paramsRef);

  for (const d of snap.docs) {
    const data = d.data();
    const groupId = d.id;

    const groupData = {
      grain: grainId,
      assignedCells: data.assignedCells || [],
      keyParam: data.keyParam || null,
      params: data.params || {},
      parameters: data.parameters || {},
      name: data.name || "",
    };

    await setDoc(
      doc(db, "grains", grainId, "groups", groupId),
      groupData,
      { merge: true }
    );
  }

  console.log("Migracja DONE:", grainId);
}
