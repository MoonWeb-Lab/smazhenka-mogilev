import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { EMIL_EASE_OUT, SPRING_SNAPPY } from '../lib/motion';

interface CartToastProps {
  message: string | null;
}

export function CartToast({ message }: CartToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          id="cart-toast"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: SPRING_SNAPPY }}
          exit={{ opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.16, ease: EMIL_EASE_OUT } }}
          className="pointer-events-none fixed right-4 top-20 z-30 flex max-w-[320px] items-center gap-2.5 rounded-xl bg-bakery-charcoal px-4 py-2.5 text-xs font-semibold text-white shadow-sm"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bakery-amber text-white">
            <Check className="h-3 w-3" aria-hidden="true" />
          </span>
          <span className="truncate">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
