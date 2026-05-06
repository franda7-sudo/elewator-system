import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

const AdminUserContext = createContext();

export function AdminUserProvider({ children }) {
  const [admins, setAdmins] = useState([]);
  const [operators, setOperators] = useState([]);
  const [logs, setLogs] = useState([]);

  const loadData = async () => {
    const adminsSnap = await getDocs(collection(db, "adminRoles"));
    setAdmins(adminsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const opSnap = await getDocs(collection(db, "users"));
    setOperators(opSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const logsSnap = await getDocs(collection(db, "userLogs"));
    setLogs(logsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminUserContext.Provider
      value={{ admins, operators, logs, reload: loadData }}
    >
      {children}
    </AdminUserContext.Provider>
  );
}

export const useAdminUsers = () => useContext(AdminUserContext);
