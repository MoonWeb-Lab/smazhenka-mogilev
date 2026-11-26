import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { EMIL_EASE_OUT, SPRING_MODAL, SPRING_SNAPPY } from '../lib/motion';
import type { DishItem } from '../types/menu';

interface DishModalProps {
  dish: DishItem | null;
  onClose: () => void;
  onAddToCart: (dishId: string, qty: number) => void;
  isCartOpen: boolean;
}

export function DishModal({ dish, onClose, onAddToCart, isCartOpen }: DishModalProps) {
  const [qty, setQty] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dish) setQty(1);
  }, [dish]);

  useFocusTrap(Boolean(dish), modalRef, onClose, false, !isCartOpen);

  const nutritionRows = dish
    ? [
        {
          label: 'Калории',
          per100: `${Math.round(dish.per100.kcal)} ккал`,
          perPortion: `${Math.round(dish.per100.kcal * dish.factor)} ккал`,
        },
        {
          label: 'Белки',
          per100: `${dish.per100.protein.toFixed(1)} г`,
          perPortion: `${(dish.per100.protein * dish.factor).toFixed(1)} г`,
        },
        {
          label: 'Жиры',
          per100: `${dish.per100.fat.toFixed(1)} г`,
          perPortion: `${(dish.per100.fat * dish.factor).toFixed(1)} г`,
        },
        {
          label: 'Углеводы',
          per100: `${dish.per100.carbs.toFixed(1)} г`,
          perPortion: `${(dish.per100.carbs * dish.factor).toFixed(1)} г`,
        },
      ]
    : [];

  return (
    <AnimatePresence>
      {dish && (
        <>
          <motion.div
            id="dish-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EMIL_EASE_OUT }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[3px]"
            aria-hidden="true"
          />

          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              ref={modalRef}
              id="dish-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="dish-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: SPRING_MODAL }}
              exit={{ opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.15, ease: EMIL_EASE_OUT } }}
              className="pointer-events-auto relative flex max-h-[calc(100vh-24px)] w-full max-w-[540px] flex-col overflow-hidden rounded-[14px] border border-bakery-border bg-bakery-surface shadow-2xl"
            >
              <motion.button
                type="button"
                id="close-dish-btn"
                whileTap={{ scale: 0.92 }}
                transition={SPRING_SNAPPY}
                onClick={onClose}
                aria-label="Закрыть карточку блюда"
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-bakery-border bg-bakery-page/95 text-bakery-ink transition-colors hover:bg-bakery-surface"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </motion.button>

              <div className="aspect-[2/1] max-h-[235px] w-full shrink-0 overflow-hidden bg-bakery-subtle">
                <img
                  id="dish-modal-img"
                  src={dish.image}
                  alt={dish.alt}
                  width={560}
                  height={280}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
                <div className="flex flex-col items-start justify-between gap-1 sm:flex-row sm:gap-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3
                      id="dish-modal-title"
                      className="font-display text-xl font-bold leading-tight text-bakery-ink"
                    >
                      {dish.name}
                    </h3>
                    <span id="dish-modal-weight" className="num text-xs font-semibold text-bakery-textMuted">
                      {dish.weight}
                    </span>
                  </div>
                  <span
                    id="dish-modal-price"
                    className="num whitespace-nowrap font-display text-xl font-extrabold text-bakery-red"
                  >
                    {dish.price.toFixed(2)} BYN
                  </span>
                </div>

                <p id="dish-modal-desc" className="text-sm leading-relaxed text-bakery-secondary">
                  {dish.description}
                </p>

                <div className="flex flex-col gap-1 border-t border-bakery-border pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-bakery-textMuted">
                    Состав
                  </h4>
                  <p id="dish-modal-ingredients" className="text-sm leading-relaxed text-bakery-ink">
                    {dish.ingredients}
                  </p>
                </div>

                <div className="flex flex-col gap-1 border-t border-bakery-border pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-bakery-textMuted">
                    Пищевая ценность (КБЖУ)
                  </h4>
                  <table className="nutrition-table w-full border-collapse text-sm" aria-label="Пищевая ценность блюда">
                    <thead>
                      <tr className="border-b border-bakery-border text-left text-xs font-semibold text-bakery-textMuted">
                        <th className="py-1.5">Показатель</th>
                        <th className="num py-1.5 text-right">На 100 г</th>
                        <th className="num py-1.5 text-right" id="dish-portion-col">
                          На порцию ({dish.weight})
                        </th>
                      </tr>
                    </thead>
                    <tbody id="dish-nutrition-body">
                      {nutritionRows.map((row) => (
                        <tr
                          key={row.label}
                          className="border-b border-bakery-border last:border-b-0"
                        >
                          <td className="py-1.5 text-bakery-secondary">{row.label}</td>
                          <td className="num py-1.5 text-right font-semibold text-bakery-ink">
                            {row.per100}
                          </td>
                          <td className="num py-1.5 text-right font-semibold text-bakery-ink">
                            {row.perPortion}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 border-t border-bakery-border bg-bakery-page px-5 py-3.5 sm:px-6">
                <div
                  className="inline-flex h-10 items-center gap-1 rounded-md border border-bakery-border bg-bakery-subtle p-1"
                  role="group"
                  aria-label="Выбор количества"
                >
                  <motion.button
                    type="button"
                    id="dish-qty-dec"
                    whileTap={{ scale: 0.92 }}
                    transition={SPRING_SNAPPY}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Уменьшить количество"
                    className="flex h-8 w-8 items-center justify-center rounded bg-bakery-surface text-base font-bold text-bakery-ink transition-colors hover:bg-bakery-red hover:text-white"
                  >
                    -
                  </motion.button>
                  <span
                    id="dish-qty-val"
                    className="num min-w-[26px] text-center font-display text-sm font-bold text-bakery-ink"
                    aria-live="polite"
                  >
                    {qty}
                  </span>
                  <motion.button
                    type="button"
                    id="dish-qty-inc"
                    whileTap={{ scale: 0.92 }}
                    transition={SPRING_SNAPPY}
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Увеличить количество"
                    className="flex h-8 w-8 items-center justify-center rounded bg-bakery-surface text-base font-bold text-bakery-ink transition-colors hover:bg-bakery-red hover:text-white"
                  >
                    +
                  </motion.button>
                </div>

                <motion.button
                  type="button"
                  id="dish-add-btn"
                  whileTap={{ scale: 0.97 }}
                  transition={SPRING_SNAPPY}
                  onClick={() => {
                    onAddToCart(dish.id, qty);
                    onClose();
                  }}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-bakery-red px-4 text-sm font-semibold text-white transition-colors hover:bg-bakery-redHover"
                >
                  Добавить в корзину: {(dish.price * qty).toFixed(2)} BYN
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
