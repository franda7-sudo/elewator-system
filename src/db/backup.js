import localDB from './pouchdb';

export const exportDatabase = async () => {
  const allDocs = await localDB.allDocs({ include_docs: true });
  const payload = {
    exportedAt: new Date().toISOString(),
    docs: allDocs.rows.map(r => r.doc)
  };
  return payload;
};

export const importDatabase = async (payload) => {
  if (!payload || !Array.isArray(payload.docs)) {
    throw new Error('Nieprawidłowy format backupu.');
  }

  await localDB.destroy();
  const newDB = new localDB.constructor('elewator_db', { auto_compaction: true });

  await newDB.bulkDocs(payload.docs);

  console.log('✅ Import bazy zakończony.');
};
