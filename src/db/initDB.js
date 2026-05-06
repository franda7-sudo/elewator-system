const initSilos = async () => {
  const silosToCreate = [];
  
  // Generuj 40 silosów S
  for(let i=1; i<=40; i++) {
    silosToCreate.push({ _id: `silo_${i}S`, type: 'S', layers: [], capacity: 500 });
  }
  // Generuj 12 silosów N
  for(let i=1; i<=12; i++) {
    silosToCreate.push({ _id: `silo_${i}N`, type: 'N', layers: [], capacity: 200 });
  }
  // Generuj 8 gwiazd G
  for(let i=1; i<=8; i++) {
    silosToCreate.push({ _id: `silo_${i}G`, type: 'G', layers: [], capacity: 80 });
  }

  try {
    await localDB.bulkDocs(silosToCreate);
    console.log("Elewator zainicjalizowany!");
  } catch (err) {
    console.log("Silosy już istnieją lub błąd:", err);
  }
};

// Wywołaj to raz w App.js lub tutaj
// initSilos();