import React from "react";
import AddUserPanel from "../Admin/AddUserPanel";

export default function OwnerUsers() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Zarządzanie użytkownikami</h1>
      <AddUserPanel />
    </div>
  );
}
