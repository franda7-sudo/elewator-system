import { Outlet } from "react-router-dom";
import { useEffect } from "react";

export default function OperatorLayout() {
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) window.location.href = "/operator-login";
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Outlet />
    </div>
  );
}
