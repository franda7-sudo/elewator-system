import { useState } from "react";
import { useElevator } from "../../context/ElevatorContext";
import { voidToTons } from "../../utils/grainCalculations";
export default function VoidMeasurementForm({ komora, onClose }) {
const { cells, updateCell, addHistory } = useElevator();
const [val, setVal] = useState("");
const submit = (e) => {
e.preventDefault();
const tons = voidToTons(Number(val), komora, cells[komora].grain);
updateCell(komora, { amount: tons });
addHistory({ type: "pomiar", cell: komora, msg: `Pustka ${val}m -> ${tons}t` });
onClose();
};
return (
<div className="form-box">
<h3>Pomiar: {komora}</h3>
<form onSubmit={submit}>
<label>Pustka [m]</label>

<input type="number" step="0.01" value={val} onChange={e =>
setVal(e.target.value)} required />
<button type="submit" className="action-btn">Zapisz</button>
</form>
</div>
);
}