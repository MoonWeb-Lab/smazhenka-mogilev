import { useRef, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { BAKERY_PHONE_DISPLAY, MIN_ORDER_AMOUNT } from '../data/menuData';
import { SPRING_SNAPPY } from '../lib/motion';
import type { DeliveryMethod, PickupSpotId } from '../types/menu';
import { isValidBelarusPhone } from '../utils/phoneValidation';

interface CheckoutFormProps {
  subtotal: number;
  orderTotal: number;
  remainingForMin: number;
  deliveryMethod: DeliveryMethod;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  selectedSpot: PickupSpotId;
  onSelectedSpotChange: (spot: PickupSpotId) => void;
  onOpenPolicy: () => void;
  onSuccess: (message: string) => void;
}

export function CheckoutForm({
  subtotal,
  orderTotal,
  remainingForMin,
  deliveryMethod,
  onDeliveryMethodChange,
  selectedSpot,
  onSelectedSpotChange,
  onOpenPolicy,
  onSuccess,
}: CheckoutFormProps) {
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
    const message =
      deliveryMethod === 'delivery'
        ? `Курьер привезёт заказ по адресу: ${street.trim()}. Если нужно уточнить детали, звоните ${BAKERY_PHONE_DISPLAY}.`
        : `Готовим к вашему времени на точке: ${spotLabel}. Ждём вас в пекарне.`;

    setStreet('');
    setApt('');
    setEntrance('');
    setFloor('');
    setComment('');
    setName('');
    setPhone('');
    setReadyTime('15');
    setConsent(true);
    onSuccess(message);
  };

  const canCheckout = remainingForMin <= 0 && consent;
  const submitLabel =
    remainingForMin > 0
      ? `Добавьте ещё на ${remainingForMin.toFixed(2)} BYN (минимум 20)`
      : !consent
      ? 'Требуется согласие на обработку данных'
      : `Отправить заказ на ${orderTotal.toFixed(2)} BYN`;

  return (
    <form id="cart-checkout-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-bakery-secondary">Способ получения</span>
        <div
          className="grid grid-cols-2 gap-1 rounded-lg bg-bakery-subtle p-1"
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
            className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              deliveryMethod === 'pickup'
                ? 'bg-bakery-surface text-bakery-ink shadow-xs'
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
            className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              deliveryMethod === 'delivery'
                ? 'bg-bakery-surface text-bakery-ink shadow-xs'
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
            className="h-9 w-full rounded-lg border border-bakery-border bg-bakery-surface px-3 text-sm text-bakery-ink"
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
              className={`h-9 w-full rounded-lg border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled ${
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
                className="h-9 w-full rounded-lg border border-bakery-border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled"
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
                className="h-9 w-full rounded-lg border border-bakery-border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled"
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
                className="h-9 w-full rounded-lg border border-bakery-border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled"
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
              className="h-9 w-full rounded-lg border border-bakery-border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled"
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
          className={`h-9 w-full rounded-lg border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled ${
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
          className={`h-9 w-full rounded-lg border bg-bakery-surface px-3 text-sm text-bakery-ink placeholder:text-bakery-disabled ${
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
          className="h-9 w-full rounded-lg border border-bakery-border bg-bakery-surface px-3 text-sm text-bakery-ink"
        >
          <option value="15">Как можно скорее</option>
          <option value="30">Через 30 минут</option>
          <option value="45">Через 45 минут</option>
          <option value="60">Через 1 час</option>
        </select>
      </div>

      <div className="py-1">
        <label className="flex cursor-pointer select-none items-start gap-2">
          <input
            id="order-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-bakery-amber"
          />
          <span className="text-xs leading-snug text-bakery-textMuted">
            Даю согласие на{' '}
            <button
              type="button"
              id="open-policy-btn"
              onClick={onOpenPolicy}
              className="border-0 bg-transparent p-0 font-inherit text-bakery-amberInk underline"
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
        className={`w-full whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
          canCheckout
            ? 'bg-bakery-charcoal text-white hover:bg-bakery-charcoalHover'
            : 'cursor-not-allowed bg-bakery-muted text-bakery-textMuted opacity-70'
        }`}
      >
        <span id="checkout-btn-text">{submitLabel}</span>
      </motion.button>
    </form>
  );
}
