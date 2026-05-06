// src/admin/cells/normalizeCellData.js
export function normalizeCellData(data) {
  return {
    grain: data.grain || data.ziarno || null,
    białko: data.białko ?? (data.parametr === "białko" ? data.parametrFrom : null),

    param: data.param || data.parametr || null,
    paramFrom: data.paramFrom ?? data.parametrFrom ?? null,
    paramTo: data.paramTo ?? data.parametrDo ?? null,

    groupId: data.groupId || data["grupa jakości"] || null,

    color: data.color && data.color !== "#cccccc" ? data.color : null,

    waga: data.waga ?? 0,
    pojemność: data.pojemność ?? 0,
    pełny: data.pełny ?? false,
    zamknięte: data.zamknięte ?? false,

    wilgotność: data.wilgotność ?? null,
    gęstość: data.gęstość ?? null,
  };
}
