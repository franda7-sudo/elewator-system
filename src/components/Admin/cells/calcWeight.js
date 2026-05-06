export function getMultiplier(grain, id) {
  const g = grain?.toLowerCase();

  // S + G
  if (id.endsWith("S") || id.endsWith("G")) {
    return {
      pszenica: 11.5,
      żyto: 11,
      zyto: 11,
      owies: 8,
      jęczmień: 10,
      jeczmien: 10,
      pellet: 9.5
    }[g] || 0;
  }

  // N
  if (id.endsWith("N")) {
    return {
      pszenica: 39.5,
      żyto: 39,
      zyto: 39
    }[g] || 0;
  }

  // O (43–52)
  const O_CAP = {
    "43": 4,
    "44": 2.5,
    "45": 2.5,
    "46": 5,
    "47": 5,
    "48": 2.5,
    "49": 2.5,
    "50": 5,
    "51": 2.5,
    "52": 2.5
  };

  return O_CAP[id] || 0;
}

export function getCapacity(id) {
  if (id.endsWith("S") || id.endsWith("G")) return 250;
  if (id.endsWith("N")) return 1060;

  const O_CAP = {
    "43": 80,
    "44": 60,
    "45": 60,
    "46": 120,
    "47": 120,
    "48": 60,
    "49": 60,
    "50": 120,
    "51": 60,
    "52": 60
  };

  return O_CAP[id] || 0;
}

export function calculateWeight(grain, id, luz) {
  const mult = getMultiplier(grain, id);
  const cap = getCapacity(id);

  if (!mult || luz == null) return cap;

  const zasyp = luz * mult;
  return Math.max(0, cap - zasyp);
}
