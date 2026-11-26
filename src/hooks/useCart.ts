import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DELIVERY_FEE,
  DISHES,
  FREE_DELIVERY_THRESHOLD,
  MIN_ORDER_AMOUNT,
} from '../data/menuData';
import type { CartEntry, DeliveryMethod, DishItem, PickupSpotId } from '../types/menu';

const STORAGE_KEY = 'smazhenka_state_v1';

interface PersistedState {
  items?: Record<string, { qty: number }>;
  deliveryMethod?: DeliveryMethod;
  selectedSpot?: PickupSpotId;
}

function readInitialState(): {
  quantities: Record<string, number>;
  deliveryMethod: DeliveryMethod;
  selectedSpot: PickupSpotId;
} {
  const quantities: Record<string, number> = {};
  let deliveryMethod: DeliveryMethod = 'pickup';
  let selectedSpot: PickupSpotId = 'chel';

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { quantities, deliveryMethod, selectedSpot };
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed && typeof parsed === 'object') {
      if (parsed.items && typeof parsed.items === 'object') {
        const validIds = new Set(DISHES.map((d) => d.id));
        for (const [id, entry] of Object.entries(parsed.items)) {
          if (validIds.has(id) && entry && Number.isInteger(entry.qty) && entry.qty > 0) {
            quantities[id] = entry.qty;
          }
        }
      }
      if (parsed.deliveryMethod === 'delivery' || parsed.deliveryMethod === 'pickup') {
        deliveryMethod = parsed.deliveryMethod;
      }
      if (parsed.selectedSpot === 'chel' || parsed.selectedSpot === 'stroit') {
        selectedSpot = parsed.selectedSpot;
      }
    }
  } catch {
    // localStorage unavailable
  }

  return { quantities, deliveryMethod, selectedSpot };
}

export function useCart() {
  const initial = useMemo(() => readInitialState(), []);
  const [quantities, setQuantities] = useState<Record<string, number>>(initial.quantities);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(initial.deliveryMethod);
  const [selectedSpot, setSelectedSpot] = useState<PickupSpotId>(initial.selectedSpot);

  useEffect(() => {
    try {
      const itemsToSave: Record<string, { qty: number; price: number; name: string }> = {};
      for (const dish of DISHES) {
        const qty = quantities[dish.id];
        if (qty && qty > 0) {
          itemsToSave[dish.id] = { qty, price: dish.price, name: dish.name };
        }
      }
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: itemsToSave, deliveryMethod, selectedSpot })
      );
    } catch {
      // localStorage unavailable
    }
  }, [quantities, deliveryMethod, selectedSpot]);

  const addItem = useCallback((dishId: string, amount = 1) => {
    setQuantities((prev) => ({
      ...prev,
      [dishId]: (prev[dishId] || 0) + amount,
    }));
  }, []);

  const updateItemQty = useCallback((dishId: string, delta: number) => {
    setQuantities((prev) => {
      const nextQty = (prev[dishId] || 0) + delta;
      if (nextQty <= 0) {
        const next = { ...prev };
        delete next[dishId];
        return next;
      }
      return { ...prev, [dishId]: nextQty };
    });
  }, []);

  const clearCart = useCallback(() => {
    setQuantities({});
  }, []);

  const cartEntries: CartEntry[] = useMemo(() => {
    const map = new Map<string, DishItem>(DISHES.map((d) => [d.id, d]));
    return Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const dish = map.get(id);
        return dish ? { dish, qty } : null;
      })
      .filter((entry): entry is CartEntry => entry !== null);
  }, [quantities]);

  const totalCount = useMemo(
    () => cartEntries.reduce((acc, item) => acc + item.qty, 0),
    [cartEntries]
  );

  const subtotal = useMemo(
    () => cartEntries.reduce((acc, item) => acc + item.qty * item.dish.price, 0),
    [cartEntries]
  );

  const deliveryFee =
    deliveryMethod === 'delivery' && subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD
      ? DELIVERY_FEE
      : 0;

  const orderTotal = totalCount > 0 ? subtotal + deliveryFee : 0;
  const remainingForMin = Math.max(0, MIN_ORDER_AMOUNT - subtotal);
  const minProgress = Math.min(1, subtotal / MIN_ORDER_AMOUNT);

  return {
    quantities,
    cartEntries,
    totalCount,
    subtotal,
    deliveryFee,
    orderTotal,
    remainingForMin,
    minProgress,
    deliveryMethod,
    setDeliveryMethod,
    selectedSpot,
    setSelectedSpot,
    addItem,
    updateItemQty,
    clearCart,
  };
}
