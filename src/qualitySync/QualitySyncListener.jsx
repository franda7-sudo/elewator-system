import { useEffect } from 'react';
import {
  collection,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase'; // dostosuj ścieżkę do swojego pliku z konfiguracją

export default function QualitySyncListener() {
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'grains'), async (grainsSnap) => {
      for (const grainDoc of grainsSnap.docs) {
        const grainId = grainDoc.id;
        const groupsSnap = await getDocs(
          collection(db, 'grains', grainId, 'groups')
        );

        for (const groupDoc of groupsSnap.docs) {
          const data = groupDoc.data();
          const assignedCells = data.assignedCells || [];
          const keyParam = data.keyParam;
          const params = data.params || {};
          const keyParamConfig = params[keyParam] || {};
          const min = keyParamConfig.min ?? null;
          const max = keyParamConfig.max ?? null;

          // Ustaw dane w cells dla każdej komórki
          for (const cellId of assignedCells) {
            const cellRef = doc(db, 'cells', cellId);
            await setDoc(
              cellRef,
              {
                grain: grainId,
                groupId: groupDoc.id,
                param: keyParam,
                paramFrom: min,
                paramTo: max,
              },
              { merge: true }
            );
          }
        }
      }
    });

    return () => unsub();
  }, []);

  return null; // nic nie renderuje, tylko działa w tle
}
