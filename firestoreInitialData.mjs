// 📂 src/seed/firestoreInitialData.js

// Komory: S, N, G, W — puste, gotowe do produkcji
export const INITIAL_CELLS = {
  // STARY ELEWATOR (S)
  "1S": { grainId: null, groupId: null, weight: 0, capacity: 30000 },
  "2S": { grainId: null, groupId: null, weight: 0, capacity: 30000 },
  "3S": { grainId: null, groupId: null, weight: 0, capacity: 30000 },
  "4S": { grainId: null, groupId: null, weight: 0, capacity: 30000 },
  "5S": { grainId: null, groupId: null, weight: 0, capacity: 30000 },
  "6S": { grainId: null, groupId: null, weight: 0, capacity: 30000 },
  "7S": { grainId: null, groupId: null, weight: 0, capacity: 30000 },
  "8S": { grainId: null, groupId: null, weight: 0, capacity: 30000 },
  "9S": { grainId: null, groupId: null, weight: 0, capacity: 30000 },
  "10S": { grainId: null, groupId: null, weight: 0, capacity: 30000 },

  // NOWY ELEWATOR (N)
  "1N": { grainId: null, groupId: null, weight: 0, capacity: 35000 },
  "2N": { grainId: null, groupId: null, weight: 0, capacity: 35000 },
  "3N": { grainId: null, groupId: null, weight: 0, capacity: 35000 },
  "4N": { grainId: null, groupId: null, weight: 0, capacity: 35000 },
  "5N": { grainId: null, groupId: null, weight: 0, capacity: 35000 },
  "6N": { grainId: null, groupId: null, weight: 0, capacity: 35000 },
  "7N": { grainId: null, groupId: null, weight: 0, capacity: 35000 },
  "8N": { grainId: null, groupId: null, weight: 0, capacity: 35000 },
  "9N": { grainId: null, groupId: null, weight: 0, capacity: 35000 },
  "10N": { grainId: null, groupId: null, weight: 0, capacity: 35000 },

  // KOMORY G
  "21G": { grainId: null, groupId: null, weight: 0, capacity: 15000 },
  "22G": { grainId: null, groupId: null, weight: 0, capacity: 15000 },
  "23G": { grainId: null, groupId: null, weight: 0, capacity: 15000 },
  "24G": { grainId: null, groupId: null, weight: 0, capacity: 15000 },
  "25G": { grainId: null, groupId: null, weight: 0, capacity: 15000 },

  // KOMORY WYDAWCZE (W)
  "43": { grainId: null, groupId: null, weight: 0, capacity: 8000 },
  "44": { grainId: null, groupId: null, weight: 0, capacity: 8000 },
  "45": { grainId: null, groupId: null, weight: 0, capacity: 8000 },
  "46": { grainId: null, groupId: null, weight: 0, capacity: 8000 },
  "47": { grainId: null, groupId: null, weight: 0, capacity: 8000 },
  "48": { grainId: null, groupId: null, weight: 0, capacity: 8000 },
  "49": { grainId: null, groupId: null, weight: 0, capacity: 8000 },
  "50": { grainId: null, groupId: null, weight: 0, capacity: 8000 },
  "51": { grainId: null, groupId: null, weight: 0, capacity: 8000 },
  "52": { grainId: null, groupId: null, weight: 0, capacity: 8000 }
};

// Zboża: puste parametry i grupy — gotowe do konfiguracji
export const INITIAL_GRAINS = {
  pszenica: {
    name: "Pszenica",
    color: "#f4a742",
    parameters: {},
    groups: {}
  },
  zyto: {
    name: "Żyto",
    color: "#c2a84a",
    parameters: {},
    groups: {}
  },
  jeczmien: {
    name: "Jęczmień",
    color: "#d1c06b",
    parameters: {},
    groups: {}
  },
  owies: {
    name: "Owies",
    color: "#e2d59a",
    parameters: {},
    groups: {}
  },
  pellet: {
    name: "Pellet",
    color: "#8b6f47",
    parameters: {},
    groups: {}
  }
};
