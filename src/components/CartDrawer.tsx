import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import {
  BAKERY_PHONE_DISPLAY,
  BAKERY_PHONE_HREF,
  MIN_ORDER_AMOUNT,
} from '../data/menuData';
import { EMIL_EASE_DRAWER, EMIL_EASE_OUT, SPRING_SNAPPY } from '../lib/motion';
import type { CartEntry, DeliveryMethod, PickupSpotId } from '../types/menu';
import { isValidBelarusPhone } from '../utils/phoneValidation';

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
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const streetRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const [street, setStreet] = useState('');
  const [apt, setApt] = useState('');
  const [entrance, setEntrance] = useState('');
  const [floor, setFloor] = useState('');
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [readyTime, setReadyTime] = useState('15');
  const [consent, setConsent] = useState(true);

  const [streetError, setStreetError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (isPolicyOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 40);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, isPolicyOpen, onClose]);

  const handleClose = () => {
    if (successMessage) setSuccessMessage('');
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (subtotal < MIN_ORDER_AMOUNT || !consent) return;

    let firstInvalid: HTMLInputElement | null = null;

    if (deliveryMethod === 'delivery') {
      if (!street.trim()) {
        setStreetError('Укажите улицу и номер дома для доставки');
        firstInvalid = firstInvalid || streetRef.current;
      } else {
        setStreetError('');
      }
    }

    if (!name.trim()) {
      setNameError('Укажите ваше имя');
      firstInvalid = firstInvalid || nameRef.current;
    } else {
      setNameError('');
    }

    if (!phone.trim()) {
      setPhoneError('Укажите номер телефона для связи');
      firstInvalid = firstInvalid || phoneRef.current;
    } else if (!isValidBelarusPhone(phone.trim())) {
      setPhoneError('Введите номер в формате +375 (29) 700-70-79');
      firstInvalid = firstInvalid || phoneRef.current;
    } else {
      setPhoneError('');
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const spotLabel = selectedSpot === 'chel' ? 'ул. Челюскинцев, 37' : 'ул. Строителей, 31';
    const msg =
      deliveryMethod === 'delivery'
        ? `Курьер привезёт заказ по адресу: ${street.trim()}. Если нужно уточнить детали, звоните ${BAKERY_PHONE_DISPLAY}.`
        : `Готовим к вашему времени на точке: ${spotLabel}. Ждём вас в пекарне.`;

    onClearCart();
    setStreet('');
    setApt('');
    setEntrance('');
    setFloor('');
    setComment('');
    setName('');
    setPhone('');
    setReadyTime('15');
    setConsent(true);
    setSuccessMessage(msg);
  };

  const canCheckout = remainingForMin <= 0 && consent;
  const submitLabel =
    remainingForMin > 0
      ? `Добавьте ещё на ${remainingForMin.toFixed(2)} BYN (минимум 20)`
      : !consent
      ? 'Требуется согласие на обработку данных'
      : `Отправить заказ на ${orderTotal.toFixed(2)} BYN`;

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
            id="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: EMIL_EASE_DRAWER }}
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
                ref={closeBtnRef}
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
                cartEntries.map(({ dish, qty }) => (
                  <div
                    key={dish.id}
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
                  </div>
                ))
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
                <form id="cart-checkout-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-bakery-secondary">Способ получения</span>
                    <div
                      className="grid grid-cols-2 gap-1 rounded-md border border-bakery-border bg-bakery-subtle p-1"
                      role="radiogroup"
                      aria-label="Способ получения заказа"
                    >
                      <button
                        type="button"
                        id="method-pickup-btn"
                        role="radio"
                        aria-checked={deliveryMethod === 'pickup'}
                        onClick={() => {
                          onDeliveryMethodChange('pickup');
                          setStreetError('');
                        }}
                        className={`rounded px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                          deliveryMethod === 'pickup'
                            ? 'border border-bakery-border bg-bakery-surface text-bakery-ink shadow-xs'
                            : 'text-bakery-secondary'
                        }`}
                      >
                        Самовывоз
                      </button>
                      <button
                        type="button"
                        id="method-delivery-btn"
                        role="radio"
                        aria-checked={deliveryMethod === 'delivery'}
                        onClick={() => onDeliveryMethodChange('delivery')}
                        className={`rounded px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                          deliveryMethod === 'delivery'
                            ? 'border border-bakery-border bg-bakery-surface text-bakery-ink shadow-xs'
                            : 'text-bakery-secondary'
                        }`}
                      >
                        Доставка курьером
                      </button>
                    </div>
                  </div>

                  {deliveryMethod === 'pickup' ? (
                    <div className="flex flex-col gap-1">
                      <label htmlFor="order-spot" className="text-xs font-semibold text-bakery-secondary">
                        Точка самовывоза
                      </label>
                      <select
                        id="order-spot"
                        value={selectedSpot}
                        onChange={(e) => onSelectedSpotChange(e.target.value as PickupSpotId)}
                        className="h-9 w-full rounded-md border border-bakery-border bg-bakery-surface px-3 text-sm text-bakery-ink"
                      >
                        <option value="chel">ул. Челюскинцев, 37</option>
                        <option value="stroit">ул. Строителей, 31</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <label htmlFor="order-street" className="text-xs font-semibold text-bakery-secondary">
                          Улица, дом и корпус
                        </label>
                        <input
                          ref={streetRef}
                          id="order-street"
                          type="text"
                          value={street}
                          onChange={(e) => {
                            setStreet(e.target.value);
                            if (streetError) setStreetError('');
                          }}
                          placeholder="ул. Первомайская, 24"
                          autoComplete="street-address"
                          className={`h-9 w-full rounded-md border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled ${
                            streetError ? 'border-bakery-error' : 'border-bakery-border'
                          }`}
                        />
                        {streetError && (
                          <div id="street-error" role="alert" className="text-xs font-medium text-bakery-error">
                            {streetError}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col gap-1">
                          <label htmlFor="order-apt" className="text-xs font-semibold text-bakery-secondary">
                            Квартира
                          </label>
                          <input
                            id="order-apt"
                            type="text"
                            value={apt}
                            onChange={(e) => setApt(e.target.value)}
                            placeholder="42"
                            inputMode="numeric"
                            className="h-9 w-full rounded-md border border-bakery-border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label htmlFor="order-entrance" className="text-xs font-semibold text-bakery-secondary">
                            Подъезд
                          </label>
                          <input
                            id="order-entrance"
                            type="text"
                            value={entrance}
                            onChange={(e) => setEntrance(e.target.value)}
                            placeholder="2"
                            inputMode="numeric"
                            className="h-9 w-full rounded-md border border-bakery-border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label htmlFor="order-floor" className="text-xs font-semibold text-bakery-secondary">
                            Этаж
                          </label>
                          <input
                            id="order-floor"
                            type="text"
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                            placeholder="5"
                            inputMode="numeric"
                            className="h-9 w-full rounded-md border border-bakery-border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="order-comment" className="text-xs font-semibold text-bakery-secondary">
                          Комментарий курьеру
                        </label>
                        <input
                          id="order-comment"
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Домофон, подъезд или ориентир"
                          className="h-9 w-full rounded-md border border-bakery-border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label htmlFor="order-name" className="text-xs font-semibold text-bakery-secondary">
                      Ваше имя
                    </label>
                    <input
                      ref={nameRef}
                      id="order-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError('');
                      }}
                      placeholder="Иван"
                      autoComplete="name"
                      className={`h-9 w-full rounded-md border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled ${
                        nameError ? 'border-bakery-error' : 'border-bakery-border'
                      }`}
                    />
                    {nameError && (
                      <div id="name-error" role="alert" className="text-xs font-medium text-bakery-error">
                        {nameError}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="order-phone" className="text-xs font-semibold text-bakery-secondary">
                      Телефон для связи
                    </label>
                    <input
                      ref={phoneRef}
                      id="order-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (phoneError) setPhoneError('');
                      }}
                      placeholder="+375 (29) 700-70-79"
                      autoComplete="tel"
                      className={`h-9 w-full rounded-md border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled ${
                        phoneError ? 'border-bakery-error' : 'border-bakery-border'
                      }`}
                    />
                    {phoneError && (
                      <div id="phone-error" role="alert" className="text-xs font-medium text-bakery-error">
                        {phoneError}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="order-time" className="text-xs font-semibold text-bakery-secondary">
                      К какому времени приготовить
                    </label>
                    <select
                      id="order-time"
                      value={readyTime}
                      onChange={(e) => setReadyTime(e.target.value)}
                      className="h-9 w-full rounded-md border border-bakery-border bg-bakery-surface px-3 text-sm text-bakery-ink"
                    >
                      <option value="15">Как можно скорее</option>
                      <option value="30">Через 30 минут</option>
                      <option value="45">Через 45 минут</option>
                      <option value="60">Через 1 час</option>
                    </select>
                  </div>

                  <div className="py-1">
                    <label className="flex cursor-pointer items-start gap-2 select-none">
                      <input
                        id="order-consent"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-bakery-red"
                      />
                      <span className="text-xs leading-snug text-bakery-textMuted">
                        Даю согласие на{' '}
                        <button
                          type="button"
                          id="open-policy-btn"
                          onClick={onOpenPolicy}
                          className="border-0 bg-transparent p-0 font-inherit text-bakery-red underline"
                        >
                          обработку данных
                        </button>{' '}
                        для оформления и доставки заказа.
                      </span>
                    </label>
                  </div>

                  <motion.button
                    type="submit"
                    id="checkout-submit-btn"
                    whileTap={canCheckout ? { scale: 0.98 } : undefined}
                    transition={SPRING_SNAPPY}
                    disabled={!canCheckout}
                    aria-disabled={!canCheckout}
                    className={`w-full whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
                      canCheckout
                        ? 'bg-bakery-red text-white hover:bg-bakery-redHover'
                        : 'cursor-not-allowed border border-bakery-border bg-bakery-muted text-bakery-textMuted opacity-60'
                    }`}
                  >
                    <span id="checkout-btn-text">{submitLabel}</span>
                  </motion.button>
                </form>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
