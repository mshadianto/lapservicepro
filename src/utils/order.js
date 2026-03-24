import { SERVICE_TYPES, PARTS_CATALOG } from "../data/constants";

export function calcOrderTotal(order) {
  const svcCost = order.services.reduce(
    (sum, sid) => sum + (SERVICE_TYPES.find((x) => x.id === sid)?.price || 0),
    0
  );
  const partCost = order.parts.reduce(
    (sum, p) => sum + (PARTS_CATALOG.find((x) => x.id === p.id)?.price || 0) * p.qty,
    0
  );
  return { svcCost, partCost, total: svcCost + partCost };
}

let counter = 0;

export function genOrderId(orders) {
  const existingNums = orders
    .map((o) => {
      const match = o.id.match(/SRV-\d{4}-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(Boolean);

  const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
  counter = Math.max(counter, maxNum) + 1;
  const year = new Date().getFullYear();
  return `SRV-${year}-${String(counter).padStart(3, "0")}`;
}
