import { AnimatePresence, motion } from 'framer-motion';
import { EMIL_EASE_DRAWER, SPRING_SNAPPY } from '../lib/motion';
import { getRussianPlural } from '../utils/phoneValidation';

interface OrderTrayProps {
  totalCount: number;
  orderTotal: number;
  onReset: () => void;
  onOpenCart: () => void;
}

export function OrderTray({ totalCount, orderTotal, onReset, onOpenCart }: OrderTrayProps) {
  const word = getRussianPlural(totalCount, ['позиция', 'позиции', 'позиций']);

  return (
    <AnimatePresence>
      {totalCount > 0 && (
        <motion.aside
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.24, ease: EMIL_EASE_DRAWER }}
          className="order-tray is-visible fixed bottom-0 left-0 right-0 z-20 border-t border-bakery-border bg-bakery-surface/95 px-4 py-3 shadow-lg backdrop-blur-md"
          aria-label="Текущий заказ"
        >
          <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span id="tray-count-text" className="text-xs font-semibold text-bakery-secondary">
                В заказе: {totalCount} {word}
              </span>
              <span
                id="tray-total-text"
                className="num font-display text-lg font-extrabold text-bakery-ink"
              >
                {orderTotal.toFixed(2)} BYN
              </span>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                id="tray-reset-btn"
                whileTap={{ scale: 0.96 }}
                transition={SPRING_SNAPPY}
                onClick={onReset}
                className="inline-flex items-center justify-center rounded-xl border border-bakery-border bg-bakery-surface px-3.5 py-2 text-xs font-semibold text-bakery-ink transition-colors hover:bg-bakery-subtle"
              >
                Очистить
              </motion.button>
              <motion.button
                type="button"
                id="tray-open-cart-btn"
                whileTap={{ scale: 0.96 }}
                transition={SPRING_SNAPPY}
                onClick={onOpenCart}
                className="inline-flex items-center justify-center rounded-xl bg-bakery-charcoal px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-bakery-charcoalHover"
              >
                Оформить заказ
              </motion.button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
