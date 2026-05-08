import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

/**
 * Pobiera program wydań dla obiektu (mlyn, platkarnia, kaszarnia, zewnetrzne)
 */
export const getReleaseProgram = async (objectId) => {
  const ref = doc(db, "releasePrograms", objectId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
};

/**
 * Tworzy aktywne wydanie (zamrożenie) w kolekcji activeReleases
 */
export const createActiveRelease = async ({
  objectId,
  objectLabel,
  grain,
  totalWeight,
  cells,
  operator,
}) => {
  const perCell = cells.map((c) => ({
    id: c.id,
    percent: c.percent,
    weight: (Number(totalWeight) * Number(c.percent || 0)) / 100,
  }));

  const docRef = await addDoc(collection(db, "activeReleases"), {
    objectId,
    objectLabel,
    grain,
    totalWeight: Number(totalWeight),
    cells: perCell,
    operator,
    status: "in_progress",
    startedAt: serverTimestamp(),
  });

  return { id: docRef.id, perCell };
};

/**
 * Zamyka wydanie:
 *  - odejmuje wagę z komór
 *  - zapisuje do releases
 *  - zapisuje do movements
 *  - oznacza activeRelease jako zakończone
 */
export const finalizeRelease = async (activeReleaseId, activeReleaseData) => {
  const { objectId, objectLabel, grain, totalWeight, cells, operator } =
    activeReleaseData;

  // 1) zapis do releases
  await addDoc(collection(db, "releases"), {
    objectId,
    objectLabel,
    grain,
    weight: Number(totalWeight),
    cells,
    operator,
    timestamp: serverTimestamp(),
  });

  // 2) zapis do movements (jedna pozycja zbiorcza)
  await addDoc(collection(db, "movements"), {
    type: "wydanie",
    objectId,
    objectLabel,
    grainType: grain,
    weight: Number(totalWeight),
    operator,
    timestamp: serverTimestamp(),
  });

  // 3) aktualizacja komór – tu zakładam, że masz funkcję w ElevatorContext,
  // która na podstawie listy {id, weight} odejmuje wagę z komór.
  // Jeśli chcesz, możemy to przepiąć na wywołanie z OperatorRelease.

  // 4) oznaczenie activeRelease jako zakończone
  const ref = doc(db, "activeReleases", activeReleaseId);
  await updateDoc(ref, {
    status: "finished",
    finishedAt: serverTimestamp(),
  });
};
