import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { EMIL_EASE_OUT, SPRING_MODAL, SPRING_SNAPPY } from '../lib/motion';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PolicyModal({ isOpen, onClose }: PolicyModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isOpen, modalRef, onClose, false, false);

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
              ref={modalRef}
              id="policy-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="policy-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: SPRING_MODAL }}
              exit={{ opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.15, ease: EMIL_EASE_OUT } }}
              className="pointer-events-auto flex max-h-[calc(100vh-48px)] w-full max-w-[520px] flex-col overflow-hidden rounded-2xl bg-bakery-surface shadow-2xl"
            >
              <div className="flex items-center justify-between gap-3 border-b border-bakery-border p-4">
                <h3 id="policy-modal-title" className="font-display text-lg font-bold text-bakery-ink">
                  Персональные данные
                </h3>
                <motion.button
                  type="button"
                  id="close-policy-btn"
                  whileTap={{ scale: 0.92 }}
                  transition={SPRING_SNAPPY}
                  onClick={onClose}
                  aria-label="Закрыть окно политики"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-bakery-subtle text-bakery-ink hover:bg-bakery-muted"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </motion.button>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto overscroll-contain p-4 text-sm leading-relaxed text-bakery-secondary">
                <p>
                  Пекарня «Смаженка Могилёв» использует ваши контакты только для приготовления и передачи заказа.
                </p>
                <p>
                  <strong>1. Зачем нужны данные:</strong> имя, телефон, адрес и комментарий помогают испечь заказ ко времени, уточнить детали и доставить выпечку горячей.
                </p>
                <p>
                  <strong>2. Передача третьим лицам:</strong> мы не рассылаем спам и не передаём контакты посторонним. Телефон и адрес видит только пекарь и курьер на смене.
                </p>
                <p>
                  <strong>3. Хранение:</strong> данные заявки используются только пока заказ готовится и едет к вам.
                </p>
                <p>
                  <strong>4. Вопросы:</strong> звоните в пекарню по номеру +375 (29) 700-70-79.
                </p>
              </div>

              <div className="flex justify-end border-t border-bakery-border bg-bakery-page p-4">
                <button
                  type="button"
                  id="confirm-policy-btn"
                  onClick={onClose}
                  className="rounded-xl bg-bakery-charcoal px-4 py-2 text-xs font-semibold text-white hover:bg-bakery-charcoalHover"
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
