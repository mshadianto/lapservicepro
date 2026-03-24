import { useState, useCallback } from "react";
import { INITIAL_ORDERS } from "../data/constants";
import { genOrderId } from "../utils/order";

export function useOrders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const addOrder = useCallback((formData) => {
    setOrders((prev) => {
      const newOrder = {
        id: genOrderId(prev),
        ...formData,
        status: "antrian",
        date: new Date().toISOString().split("T")[0],
        rating: null,
        completedDate: null,
        techId: formData.techId || null,
      };
      return [...prev, newOrder];
    });
  }, []);

  const updateStatus = useCallback((id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: newStatus,
              completedDate:
                newStatus === "selesai"
                  ? new Date().toISOString().split("T")[0]
                  : o.completedDate,
            }
          : o
      )
    );
  }, []);

  return { orders, setOrders, addOrder, updateStatus };
}
