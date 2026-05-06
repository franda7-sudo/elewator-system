import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

export async function migrateQualityGroupsArray() {
  console.log("🚚 Migracja quality → grains (array)…");

  const grainsSnap = await getDocs(collection(db, "quality"));

  for (const grainDoc of grainsSnap.docs) {
    const grainId = grainDoc.id;
    const data = grainDoc.data();

    const groupsArray = data.groups || [];

    console.log(`➡ Zboże: ${grainId}, grup: ${groupsArray.length}`);

    let index = 0;

    for (const group of groupsArray) {
      const groupId = `G${index + 1}`;

      const firstRange = group.ranges?.[0];
      if (!firstRange) continue;

      const payload = {
        name: group.name ?? groupId,
        color: group.color ?? "#cccccc",
        keyParam: firstRange.param ?? null,
        min: firstRange.from ?? null,
        max: firstRange.to ?? null,
        assignedCells: firstRange.cells ?? [],
      };

      const targetRef = doc(db, "grains", grainId, "groups", groupId);

      await setDoc(targetRef, payload, { merge: true });

      console.log(`   ✔ Zapisano grains/${grainId}/groups/${groupId}`);

      index++;
    }
  }

  console.log("✅ Migracja zakończona.");
}
