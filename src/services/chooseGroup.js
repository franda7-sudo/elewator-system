src/services/quality/chooseGroup.js
// 📂 src/services/quality/chooseGroup.js

/**
 * Automatyczny dobór grupy jakości na podstawie wyników z laboratorium.
 *
 * @param {Object} params
 * @param {string} params.grainId - ID zboża (np. "pszenica")
 * @param {Object} params.labValues - wartości z laboratorium, np. { bialko: 12.5, wilgotnosc: 13.8 }
 * @param {Array} params.groups - lista grup jakości [{ id, label, priority }]
 * @param {Object} params.rangesByGroup - zakresy min-max dla każdej grupy:
 *        {
 *          groupA: { bialko: {min: 12, max: 13}, wilgotnosc: {min: 12, max: 14} },
 *          groupB: { ... }
 *        }
 *
 * @returns {Object|null} - najlepsza grupa jakości lub null
 */

export function chooseGroup({ grainId, labValues, groups, rangesByGroup }) {
  if (!grainId || !labValues || !groups || !rangesByGroup) {
    console.warn("chooseGroup: brak wymaganych danych");
    return null;
  }

  const matchingGroups = [];

  for (const group of groups) {
    const groupId = group.id;
    const ranges = rangesByGroup[groupId];

    if (!ranges) continue;

    let fits = true;

    // Sprawdzamy każdy parametr z laboratorium
    for (const [paramId, value] of Object.entries(labValues)) {
      const r = ranges[paramId];

      // Jeśli grupa nie ma zakresu dla parametru → ignorujemy
      if (!r) continue;

      // Jeśli wartość nie mieści się w zakresie → grupa odpada
      if (value < r.min || value > r.max) {
        fits = false;
        break;
      }
    }

    if (fits) {
      matchingGroups.push(group);
    }
  }

  if (matchingGroups.length === 0) {
    return null; // brak pasującej grupy
  }

  // Sortujemy wg priorytetu (najwyższy wygrywa)
  matchingGroups.sort((a, b) => b.priority - a.priority);

  return matchingGroups[0];
}
3