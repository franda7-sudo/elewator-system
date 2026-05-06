import { useEffect, useState } from "react";

export function useOperatorSession() {
  const [operator, setOperator] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("operatorSession");
    if (raw) {
      try {
        setOperator(JSON.parse(raw));
      } catch {
        setOperator(null);
      }
    }
  }, []);

  const clearOperator = () => {
    localStorage.removeItem("operatorSession");
    setOperator(null);
  };

  return { operator, clearOperator };
}
