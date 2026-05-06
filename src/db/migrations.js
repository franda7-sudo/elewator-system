import localDB from './pouchdb';

const CURRENT_SCHEMA_VERSION = 1;

const getMetaDocId = () => 'meta_schema';

export const getSchemaVersion = async () => {
  try {
    const doc = await localDB.get(getMetaDocId());
    return doc.version || 0;
  } catch {
    return 0;
  }
};

export const setSchemaVersion = async (version) => {
  try {
    let doc;
    try {
      doc = await localDB.get(getMetaDocId());
      doc.version = version;
    } catch {
      doc = {
        _id: getMetaDocId(),
        version
      };
    }
    await localDB.put(doc);
  } catch (err) {
    console.error('Błąd zapisu wersji schematu:', err);
  }
};

export const runMigrations = async () => {
  const current = await getSchemaVersion();

  if (current >= CURRENT_SCHEMA_VERSION) {
    console.log(`Schemat aktualny (v${current}). Migracje niepotrzebne.`);
    return;
  }

  console.log(`Uruchamiam migracje: v${current} → v${CURRENT_SCHEMA_VERSION}`);

  // Przykład: migracje w przyszłości
  // if (current < 1) { ... }

  await setSchemaVersion(CURRENT_SCHEMA_VERSION);
  console.log('Migracje zakończone.');
};
