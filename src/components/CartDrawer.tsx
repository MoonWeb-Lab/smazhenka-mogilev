import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { BAKERY_PHONE_HREF } from '../data/menuData';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { EMIL_EASE_DRAWER, EMIL_EASE_OUT, SPRING_SNAPPY } from '../lib/motion';
import type { CartEntry, DeliveryMethod, PickupSpotId } from '../types/menu';
import { CheckoutForm } from './CheckoutForm';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartEntries: CartEntry[];
  subtotal: number;
  deliveryFee: number;
  orderTotal: number;
  remainingForMin: number;
  minProgress: number;
  deliveryMethod: DeliveryMethod;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  selectedSpot: PickupSpotId;
  onSelectedSpotChange: (spot: PickupSpotId) => void;
  onUpdateQty: (dishId: string, delta: number) => void;
  onClearCart: () => void;
  isPolicyOpen: boolean;
  onOpenPolicy: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartEntries,
  subtotal,
  deliveryFee,
  orderTotal,
  remainingForMin,
  minProgress,
  deliveryMethod,
  onDeliveryMethodChange,
  selectedSpot,
  onSelectedSpotChange,
  onUpdateQty,
  onClearCart,
  isPolicyOpen,
  onOpenPolicy,
}: CartDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleClose = () => {
    if (successMessage) setSuccessMessage('');
    onClose();
  };

  useFocusTrap(isOpen, drawerRef, handleClose, isPolicyOpen, true);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            id="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EMIL_EASE_OUT }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[3px]"
            aria-hidden="true"
          />

          <motion.aside
            ref={drawerRef}
            id="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.26, ease: EMIL_EASE_DRAWER }}
            className="fixed bottom-0 right-0 top-0 z-40 flex w-full max-w-[440px] flex-col overscroll-contain border-l border-bakery-border bg-bakery-surface shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-bakery-border p-4">
              <div className="flex flex-col gap-0.5">
                <h2 id="cart-drawer-title" className="font-display text-lg font-bold text-bakery-ink">
                  Корзина заказа
                </h2>
                <span className="text-xs text-bakery-textMuted">Минимальный заказ: от 20.00 BYN</span>
              </div>
              <motion.button
                type="button"
                id="close-cart-btn"
                whileTap={{ scale: 0.92 }}
                transition={SPRING_SNAPPY}
                onClick={handleClose}
                aria-label="Закрыть корзину"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-bakery-border bg-bakery-surface text-bakery-ink hover:bg-bakery-subtle"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </div>

            <div className="flex flex-col gap-1.5 border-b border-bakery-border bg-bakery-subtle px-4 py-3" aria-live="polite">
              <div
                id="cart-progress-status"
                className={`text-xs font-semibold ${
                  remainingForMin <= 0 ? 'text-bakery-success' : 'text-bakery-ink'
                }`}
              >
                {remainingForMin > 0
                  ? `До минимального заказа осталось: ${remainingForMin.toFixed(2)} BYN`
                  : 'Минимальный заказ набран, можно оформлять.'}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-bakery-muted">
                <div
                  id="cart-progress-bar"
                  className={`h-full origin-left rounded-full transition-transform duration-200 ease-out ${
                    remainingForMin <= 0 ? 'bg-bakery-success' : 'bg-bakery-gold'
                  }`}
                  style={{ transform: `scaleX(${minProgress})` }}
                />
              </div>
            </div>

            <div
              id="cart-items-list"
              role="region"
              aria-label="Выбранные блюда"
              className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-4"
            >
              {cartEntries.length === 0 ? (
                <div className="my-auto flex flex-col items-center gap-1 px-4 py-9 text-center">
                  <p className="font-display text-lg font-bold text-bakery-ink">В корзине пока пусто</p>
                  <p className="text-sm text-bakery-textMuted">Выберите смаженки или напитки в меню</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {cartEntries.map(({ dish, qty }) => (
                    <motion.div
                      key={dish.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.18, ease: EMIL_EASE_OUT }}
                      data-id={dish.id}
                      className="flex items-center justify-between gap-3 border-b border-bakery-border pb-3 last:border-b-0"
                    >
                      <div className="flex flex-1 flex-col gap-0.5">
                        <span className="text-sm font-semibold leading-snug text-bakery-ink">
                          {dish.name}
                        </span>
                        <span className="num text-xs text-bakery-textMuted">
                          {dish.price.toFixed(2)} BYN за шт
                        </span>
                      </div>

                      <div
                        className="inline-flex h-8 items-center gap-1 rounded-md border border-bakery-border bg-bakery-subtle p-0.5"
                        role="group"
                        aria-label={`Количество для ${dish.name}`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSuccessMessage('');
                            onUpdateQty(dish.id, -1);
                          }}
                          aria-label={`Уменьшить ${dish.name}`}
                          className="flex h-6 w-6 items-center justify-center rounded bg-bakery-surface text-sm font-bold text-bakery-ink hover:bg-bakery-red hover:text-white"
                        >
                          -
                        </button>
                        <span className="num min-w-[20px] text-center font-display text-xs font-bold text-bakery-ink">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSuccessMessage('');
                            onUpdateQty(dish.id, 1);
                          }}
                          aria-label={`Увеличить ${dish.name}`}
                          className="flex h-6 w-6 items-center justify-center rounded bg-bakery-surface text-sm font-bold text-bakery-ink hover:bg-bakery-red hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <span className="num whitespace-nowrap font-display text-sm font-bold text-bakery-ink">
                        {(qty * dish.price).toFixed(2)} BYN
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <div className="flex max-h-[62vh] flex-col gap-4 overflow-y-auto border-t border-bakery-border bg-bakery-page p-4">
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center justify-between text-bakery-secondary">
                  <span>Сумма блюд:</span>
                  <span id="cart-subtotal-val" className="num">
                    {subtotal.toFixed(2)} BYN
                  </span>
                </div>
                <div className="flex items-center justify-between text-bakery-secondary">
                  <span>{deliveryMethod === 'delivery' ? 'Доставка курьером:' : 'Самовывоз:'}</span>
                  <span
                    id="cart-delivery-val"
                    className={deliveryFee === 0 ? 'text-xs font-semibold text-bakery-success' : 'num'}
                  >
                    {deliveryMethod === 'delivery'
                      ? deliveryFee === 0
                        ? 'Бесплатно (от 40 BYN)'
                        : `${deliveryFee.toFixed(2)} BYN`
                      : 'Бесплатно'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-bakery-secondary">
                  <span>Упаковка в термопакет:</span>
                  <span className="text-xs font-semibold text-bakery-success">Бесплатно</span>
                </div>
                <div className="flex items-center justify-between border-t border-bakery-border pt-2 font-bold text-bakery-ink">
                  <span>Итого к оплате:</span>
                  <span id="cart-total-val" className="num font-display text-xl font-extrabold text-bakery-red">
                    {orderTotal.toFixed(2)} BYN
                  </span>
                </div>
              </div>

              {successMessage ? (
                <div
                  id="order-success-message"
                  className="flex flex-col gap-2 rounded-[10px] border border-bakery-success bg-bakery-surface p-4"
                >
                  <div className="success-title font-display text-lg font-bold text-bakery-success">
                    Заявка отправлена в Telegram пекарни
                  </div>
                  <div id="order-success-text" className="text-sm leading-relaxed text-bakery-secondary">
                    {successMessage}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <button
                      type="button"
                      id="order-new-btn"
                      onClick={() => setSuccessMessage('')}
                      className="rounded-md border border-bakery-border bg-bakery-surface px-3.5 py-2 text-xs font-semibold text-bakery-ink hover:bg-bakery-subtle"
                    >
                      Оформить новый заказ
                    </button>
                    <a
                      href={BAKERY_PHONE_HREF}
                      className="rounded-md bg-bakery-red px-3.5 py-2 text-xs font-semibold text-white hover:bg-bakery-redHover"
                    >
                      Позвонить в пекарню
                    </a>
                  </div>
                </div>
              ) : (
                <CheckoutForm
                  subtotal={subtotal}
                  orderTotal={orderTotal}
                  remainingForMin={remainingForMin}
                  deliveryMethod={deliveryMethod}
                  onDeliveryMethodChange={onDeliveryMethodChange}
                  selectedSpot={selectedSpot}
                  onSelectedSpotChange={onSelectedSpotChange}
                  onOpenPolicy={onOpenPolicy}
                  onSuccess={(msg) => {
                    onClearCart();
                    setSuccessMessage(msg);
                  }}
                />
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
