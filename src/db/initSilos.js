import localDB from './pouchdb';

export const initSiloStructure = async () => {
  try {
    // Pobieramy WSZYSTKIE dokumenty zaczynające się od "silo_"
    const existing = await localDB.allDocs({
      startkey: 'silo_',
      endkey: 'silo_\ufff0'
    });

    if (existing.rows.length > 0) {
      console.log("Silosy już istnieją. Pomijam inicjalizację.");
      return;
    }

    console.log("Rozpoczynam tworzenie struktury 75 komór...");
    const bulkSilos = [];

    // 1. Komory S (1S - 40S)
    for (let i = 1; i <= 40; i++) {
      bulkSilos.push({
        _id: `silo_${i}S`,
        type: 'S',
        label: `${i}S`,
        maxHeight: 24,
        layers: [],
        status: 'OK'
      });
    }

    // 2. Komory N (1N - 20N)
    for (let i = 1; i <= 20; i++) {
      bulkSilos.push({
        _id: `silo_${i}N`,
        type: 'N',
        label: `${i}N`,
        maxHeight: 28,
        layers: [],
        status: 'OK'
      });
    }

    // 3. Komory G (21G - 25G)
    for (let i = 21; i <= 25; i++) {
      bulkSilos.push({
        _id: `silo_${i}G`,
        type: 'G',
        label: `${i}G`,
        maxHeight: 28,
        layers: [],
        status: 'OK'
      });
    }

    // 4. Komory operacyjne (43–50)
    const operationalIds = ["43", "44", "45", "46", "47", "48", "49", "50"];
    operationalIds.forEach(id => {
      bulkSilos.push({
        _id: `silo_${id}`,
        type: 'OP',
        label: id,
        maxHeight: 20,
        layers: [],
        status: 'OK'
      });
    });

    await localDB.bulkDocs(bulkSilos);
    console.log("Sukces! Elewator gotowy do pracy.");

  } catch (err) {
    console.error("Błąd podczas inicjalizacji silosów:", err);
  }
};
