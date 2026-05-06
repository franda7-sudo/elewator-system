import React from "react";
import ReportLayout from "./ReportLayout";

export default function FifoReport() {
  return (
    <ReportLayout title="FIFO – Rotacja zasypów">
      {/* TU WKŁADASZ SWOJĄ LOGIKĘ RAPORTU */}
      <p className="text-zinc-300 mb-4">
        Raport FIFO przedstawia kolejność zasypów i wiek partii.
      </p>

      {/* Przykład tabeli */}
      <table className="w-full text-left border border-zinc-700">
        <thead>
          <tr className="bg-zinc-700 text-amber-300">
            <th className="p-2 border-b border-zinc-600">Komora</th>
            <th className="p-2 border-b border-zinc-600">Data zasypu</th>
            <th className="p-2 border-b border-zinc-600">Wiek</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-zinc-700">
            <td className="p-2">S1</td>
            <td className="p-2">2026-04-01</td>
            <td className="p-2">27 dni</td>
          </tr>
        </tbody>
      </table>
    </ReportLayout>
  );
}
