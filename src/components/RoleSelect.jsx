import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.opacity = 0;
    setTimeout(() => {
      document.body.style.transition = "opacity 0.5s";
      document.body.style.opacity = 1;
    }, 50);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
      <h1 className="text-4xl font-bold mb-10 text-amber-400">
        Wybierz tryb logowania
      </h1>

      <div className="flex flex-col gap-6 w-72">
        <button
          onClick={() => navigate("/operator-login")}
          className="px-8 py-4 rounded-xl bg-amber-500 text-black font-bold text-lg hover:scale-110 transition"
        >
          Operator
        </button>

        <button
          onClick={() => navigate("/admin-login")}
          className="px-8 py-4 rounded-xl bg-emerald-500 text-black font-bold text-lg hover:scale-110 transition"
        >
          Administrator
        </button>

        <button
          onClick={() => navigate("/superuser-login")}
          className="px-8 py-4 rounded-xl bg-blue-500 text-black font-bold text-lg hover:scale-110 transition"
        >
          SuperUser
        </button>
      </div>
    </div>
  );
}
