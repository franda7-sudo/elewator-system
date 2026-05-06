import { useState } from "react";
import { useElevator } from "../../context/ElevatorContext";
export default function TransferForm({ onClose }) {
const { cells, updateCell, addHistory } = useElevator();
const [from, setFrom] = useState("");
const [to, setTo] = useState("");
const [amt, setAmt] = useState("");
const handle = (e) => {
e.preventDefault();
const val = parseFloat(amt);
if (val > cells[from]?.amount) return alert("Brak towaru!");
updateCell(from, { amount: cells[from].amount - val });
const newData = cells[to].amount === 0 ? { grain: cells[from].grain } : {};
updateCell(to, { ...newData, amount: cells[to].amount + val });
addHistory({ type: "transfer", from, to, amount: val });
onClose();
};
return (
<div className="form-box">
<h3>Przerzut</h3>
<form onSubmit={handle}>
<input placeholder="Z" value={from} onChange={e =>
setFrom(e.target.value.toUpperCase())} />
<input placeholder="Do" value={to} onChange={e =>
setTo(e.target.value.toUpperCase())} />
<input type="number" placeholder="Tony" value={amt} onChange={e =>
setAmt(e.target.value)} />
<button type="submit" className="action-btn">Wykonaj</button>
</form>
</div>
);
}