import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export async function fixCells() {
  const snap = await getDocs(collection(db, "cells"));

  for (const d of snap.docs) {
    const c = d.data();
    const patch = {};

    // ziarno → grain
    if (c.ziarno && !c.grain) patch.grain = c.ziarno;

    // parametr → param
    if (c.parametr && !c.param) patch.param = c.parametr;

    // parametrFrom → paramFrom
    if (c.parametrFrom && !c.paramFrom) patch.paramFrom = c.parametrFrom;

    // parametrDo → paramTo
    if (c.parametrDo && !c.paramTo) patch.paramTo = c.parametrDo;

    // grupa jakości → groupId
    if (c["grupa jakości"] && !c.groupId) patch.groupId = c["grupa jakości"];

    // kolor: ignorujemy szary
    if (c.kolor && c.kolor !== "#cccccc") patch.color = c.kolor;
    else patch.color = null;

    // białko — NAJWAŻNIEJSZE
    if (c.parametr === "białko" && c.parametrFrom) {
      patch.białko = c.parametrFrom;
    }

    if (Object.keys(patch).length > 0) {
      await updateDoc(doc(db, "cells", d.id), patch);
      console.log("Naprawiono:", d.id, patch);
    }
  }

  alert("Naprawiono wszystkie komory.");
}
