import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { EK_PRODUCTS } from "../data/subscription";

const SubCtx = createContext();

export function useSubscription() {
  return useContext(SubCtx);
}

export function SubscriptionProvider({ children }) {
  const [plan, setPlan] = useState("starter");
  const [ekProducts, setEkProducts] = useState(EK_PRODUCTS);

  // Live price simulation
  useEffect(() => {
    const iv = setInterval(() => {
      setEkProducts((prev) =>
        prev.map((p) => {
          if (Math.random() > 0.87) {
            const ch = Math.round((p.price * (Math.random() * 0.025 - 0.008)) / 1000) * 1000;
            return { ...p, prevPrice: p.price, price: Math.max(p.price + ch, 10000) };
          }
          return p;
        })
      );
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  const value = { plan, setPlan, ekProducts };

  return <SubCtx.Provider value={value}>{children}</SubCtx.Provider>;
}
