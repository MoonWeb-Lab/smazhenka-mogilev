import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { EMIL_EASE_OUT, SPRING_MODAL, SPRING_SNAPPY } from '../lib/motion';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PolicyModal({ isOpen, onClose }: PolicyModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 40);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            id="policy-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EMIL_EASE_OUT }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[3px]"
            aria-hidden="true"
          />

          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              id="policy-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="policy-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: SPRING_MODAL }}
              exit={{ opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.15, ease: EMIL_EASE_OUT } }}
              className="pointer-events-auto flex max-h-[calc(100vh-48px)] w-full max-w-[520px] flex-col overflow-hidden rounded-[14px] border border-bakery-border bg-bakery-surface shadow-2xl"
            >
              <div className="flex items-center justify-between gap-3 border-b border-bakery-border p-4">
                <h3 id="policy-modal-title" className="font-display text-lg font-bold text-bakery-ink">
                  Персональные данные
                </h3>
                <motion.button
                  ref={closeBtnRef}
                  type="button"
                  id="close-policy-btn"
                  whileTap={{ scale: 0.92 }}
                  transition={SPRING_SNAPPY}
                  onClick={onClose}
                  aria-label="Закрыть окно политики"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-bakery-border bg-bakery-surface text-bakery-ink hover:bg-bakery-subtle"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </motion.button>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto overscroll-contain p-4 text-sm leading-relaxed text-bakery-secondary">
                <p>
                  Пекарня «Смаженка» (г. Могилёв) использует данные только для оформления и доставки заказа.
                </p>
                <p>
                  <strong>1. Цели обработки:</strong> Имя, телефон, адрес и комментарий к заказу нужны только для приготовления блюд, подтверждения по телефону и доставки.
                </p>
                <p>
                  <strong>2. Конфиденциальность:</strong> Мы не передаём контакты рекламным агентствам или сторонним базам. Адрес и телефон передаются только курьеру для вручения заказа.
                </p>
                <p>
                  <strong>3. Срок хранения:</strong> Данные хранятся только до завершения заказа и закрытия смены.
                </p>
                <p>
                  <strong>4. Связь:</strong> По любым вопросам звоните в пекарню: +375 (29) 700-70-79.
                </p>
              </div>

              <div className="flex justify-end border-t border-bakery-border bg-bakery-page p-4">
                <button
                  type="button"
                  id="confirm-policy-btn"
                  onClick={onClose}
                  className="rounded-md border border-bakery-border bg-bakery-surface px-4 py-2 text-xs font-semibold text-bakery-ink hover:bg-bakery-subtle"
                >
                  Понятно
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
