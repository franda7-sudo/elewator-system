import localDB from './pouchdb';

const createSilos = (count, type, capacity) =>
  Array.from({ length: count }, (_, i) => ({
    _id: `silo_${i + 1}${type}`,
    type,
    capacity,
    layers: []
  }));

export const requiredSilos = [
  ...createSilos(40, "S", 500),
  ...createSilos(12, "N", 200),
  ...createSilos(8, "G", 80),
  ...createSilos(15, "OP", 50)
];

export const diagnoseDatabase = async () => {
  const allDocs = await localDB.allDocs({ include_docs: true });
  const existing = new Map();

  allDocs.rows.forEach(row => {
    if (row.doc && row.doc._id) {
      existing.set(row.doc._id, row.doc);
    }
  });

  const missing = [];
  const corrupted = [];

  for (const silo of requiredSilos) {
    const doc = existing.get(silo._id);

    if (!doc) {
      missing.push(silo);
      continue;
    }

    if (!doc.type || !doc.capacity || !Array.isArray(doc.layers)) {
      corrupted.push({ expected: silo, actual: doc });
    }
  }

  return {
    totalDocs: existing.size,
    missing,
    corrupted
  };
};

export const repairDatabase = async () => {
  console.log("🔍 Diagnostyka bazy...");
  const { totalDocs, missing, corrupted } = await diagnoseDatabase();

  console.log(`📦 Istniejące dokumenty: ${totalDocs}`);
  console.log(`❗ Brakujące: ${missing.length}`);
  console.log(`⚠ Uszkodzone: ${corrupted.length}`);

  const toInsert = [
    ...missing,
    ...corrupted.map(c => ({
      _id: c.expected._id,
      type: c.expected.type,
      capacity: c.expected.capacity,
      layers: Array.isArray(c.actual.layers) ? c.actual.layers : []
    }))
  ];

  if (toInsert.length > 0) {
    console.log("🛠 Naprawiam bazę — uzupełniam brakujące/uszkodzone silosy...");
    await localDB.bulkDocs(toInsert);
    console.log("✅ Naprawa zakończona.");
  } else {
    console.log("✔ Baza kompletna i poprawna.");
  }
};
