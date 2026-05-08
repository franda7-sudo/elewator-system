import { useElevator } from "../../context/ElevatorContext";
import { db } from "../../firebase";
import { getReleaseProgram, createActiveRelease, finalizeRelease } from "../../logic/ReleaseEngine";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  getReleaseProgram,
  createActiveRelease,
  finalizeRelease,
} from "../logic/ReleaseEngine";
import "./OperatorView.css";

const OBJECTS = [
  { id: "mlyn", label: "Młyn" },
  { id: "platkarnia", label: "Płatkarnia" },
  { id: "kaszarnia", label: "Kaszarnia" },
  { id: "zewnetrzne", label: "Wydania zewnętrzne" },
];

export default function OperatorRelease() {
  const { operator, confirmRelease } = useElevator();

  const [selectedObject, setSelectedObject] = useState("mlyn");
  const [grain, setGrain] = useState("");
  const [program, setProgram] = useState(null);
  const [plannedWeight, setPlannedWeight] = useState("");
  const [activeRelease, setActiveRelease] = useState(null);
  const [activeReleases, setActiveReleases] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "activeReleases"), (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setActiveReleases(arr.filter((r) => r.status === "in_progress"));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const loadProgram = async () => {
      const p = await getReleaseProgram(selectedObject);
      setProgram(p);
      if (p?.grain && p.grain !== "*") setGrain(p.grain);
    };
    loadProgram();
  }, [selectedObject]);

  const startRelease = async () => {
    if (!program) return alert("Brak programu wydań dla tego obiektu.");
    if (!grain) return alert("Wybierz zboże.");
    if (!plannedWeight || isNaN(plannedWeight))
      return alert("Podaj planowaną wagę.");

    const objectLabel =
      OBJECTS.find((o) => o.id === selectedObject)?.label ||
      selectedObject;

    const { id, perCell } = await createActiveRelease({
      objectId: selectedObject,
      objectLabel,
      grain,
      totalWeight: Number(plannedWeight),
      cells: program.cells || [],
      operator: operator?.name || "operator",
    });

    setActiveRelease({
      id,
      objectId: selectedObject,
      objectLabel,
      grain,
      totalWeight: Number(plannedWeight),
      cells: perCell,
      operator: operator?.name || "operator",
    });

    alert("Wydanie uruchomione. Po zakończeniu kliknij 'Zakończ wydanie'.");
  };

  const finishRelease = async () => {
    if (!activeRelease) return alert("Brak aktywnego wydania.");

    await finalizeRelease(activeRelease.id, activeRelease);

    // lokalna logika aktualizacji komór (opcjonalnie)
    if (confirmRelease) {
      for (const c of activeRelease.cells) {
        await confirmRelease({
          grain: activeRelease.grain,
          weight: c.weight,
          cell: c.id,
          operator: activeRelease.operator,
          createdAt: Date.now(),
        });
      }
    }

    setActiveRelease(null);
    setPlannedWeight("");
    alert("Wydanie zakończone i rozliczone.");
  };

  const currentProgramCells = program?.cells || [];

  return (
    <div className="operator-view">
      <h2>Wydania zboża</h2>

      <div style={{ marginBottom: 16 }}>
        {OBJECTS.map((o) => (
          <button
            key={o.id}
            className={
              selectedObject === o.id ? "cell selected" : "cell"
            }
            style={{ marginRight: 8 }}
            onClick={() => {
              setSelectedObject(o.id);
              setActiveRelease(null);
              setPlannedWeight("");
            }}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>
          Zboże:{" "}
          <input
            value={grain}
            onChange={(e) => setGrain(e.target.value)}
            disabled={program?.grain && program.grain !== "*"}
          />
        </label>
      </div>

      <h3>Program komór</h3>
      {currentProgramCells.length === 0 ? (
        <p>Brak zdefiniowanych komór dla tego obiektu.</p>
      ) : (
        <ul>
          {currentProgramCells.map((c, i) => (
            <li key={i}>
              {c.id} — {c.percent}%
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 16 }}>
        <label>
          Planowana waga wydania (t):{" "}
          <input
            type="number"
            value={plannedWeight}
            onChange={(e) => setPlannedWeight(e.target.value)}
          />
        </label>
      </div>

      {!activeRelease ? (
        <button
          style={{ marginTop: 16 }}
          className="action-btn"
          onClick={startRelease}
        >
          ➜ Rozpocznij wydanie
        </button>
      ) : (
        <>
          <h3 style={{ marginTop: 16 }}>Aktywne wydanie</h3>
          <p>
            Obiekt: {activeRelease.objectLabel} | Zboże:{" "}
            {activeRelease.grain} | Waga:{" "}
            {activeRelease.totalWeight} t
          </p>
          <ul>
            {activeRelease.cells.map((c, i) => (
              <li key={i}>
                {c.id} — {c.percent}% → {c.weight.toFixed(2)} t
              </li>
            ))}
          </ul>
          <button
            style={{ marginTop: 16 }}
            className="action-btn"
            onClick={finishRelease}
          >
            ✔ Zakończ wydanie
          </button>
        </>
      )}

      {activeReleases.length > 0 && (
        <>
          <h3 style={{ marginTop: 24 }}>Inne aktywne wydania</h3>
          <ul>
            {activeReleases.map((r) => (
              <li key={r.id}>
                {r.objectLabel} — {r.grain} — {r.totalWeight} t —{" "}
                {r.operator}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
