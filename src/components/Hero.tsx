import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BAKERY_PHONE_DISPLAY, BAKERY_PHONE_HREF } from '../data/menuData';
import { EMIL_EASE_OUT, SPRING_SNAPPY } from '../lib/motion';
import { getMogilevBakeryStatus } from '../utils/bakeryHours';

export function Hero() {
  const [status, setStatus] = useState(() => getMogilevBakeryStatus());

  useEffect(() => {
    const id = window.setInterval(() => {
      setStatus(getMogilevBakeryStatus());
    }, 60000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="hero" className="border-b border-bakery-border bg-bakery-page py-9 sm:py-12" aria-labelledby="hero-title">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-5 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EMIL_EASE_OUT }}
          className="mb-8 flex max-w-[820px] flex-col items-start gap-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="inline-flex items-center gap-2 rounded-md border border-bakery-border bg-bakery-surface px-3 py-1.5 text-xs font-semibold text-bakery-ink"
              aria-live="polite"
            >
              <span
                id="status-dot"
                className={`h-2 w-2 rounded-full ${
                  status.isOpen ? 'bg-bakery-success' : 'bg-bakery-gold'
                }`}
                aria-hidden="true"
              />
              <span id="status-text">{status.label}</span>
            </div>
            <span className="inline-flex items-center rounded-md border border-bakery-gold/35 bg-bakery-goldSoft px-3 py-1.5 text-xs font-bold text-bakery-goldInk">
              Выпечка от 2.80 BYN
            </span>
          </div>

          <h1
            id="hero-title"
            className="font-display text-[clamp(2.15rem,4.2vw+0.6rem,3.65rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-bakery-ink"
          >
            Горячие могилёвские смаженки прямо из печи
          </h1>

          <p className="max-w-[60ch] text-base leading-relaxed text-bakery-secondary sm:text-lg">
            Пышное опарное тесто, сочная начинка и румяная корочка. Печём свежими партиями в течение дня на Челюскинцев и Строителей, принимаем предзаказы на самовывоз и доставку.
          </p>

          <div className="flex w-full flex-wrap items-center gap-3 pt-1 sm:w-auto">
            <motion.a
              whileTap={{ scale: 0.97 }}
              transition={SPRING_SNAPPY}
              href="#menu"
              className="inline-flex w-full items-center justify-center rounded-md bg-bakery-red px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-bakery-redHover sm:w-auto"
            >
              Выбрать к заказу
            </motion.a>
            <motion.a
              whileTap={{ scale: 0.97 }}
              transition={SPRING_SNAPPY}
              href="#location"
              className="inline-flex w-full items-center justify-center rounded-md border border-bakery-border bg-bakery-surface px-5 py-3 text-sm font-semibold text-bakery-ink transition-colors hover:border-bakery-borderStrong hover:bg-bakery-subtle sm:w-auto"
            >
              Адреса и режим работы
            </motion.a>
            <a
              href={BAKERY_PHONE_HREF}
              className="inline-flex w-full items-center justify-center rounded-md px-3 py-2.5 text-sm font-semibold text-bakery-secondary transition-colors hover:bg-bakery-subtle hover:text-bakery-ink sm:w-auto"
            >
              {BAKERY_PHONE_DISPLAY}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: EMIL_EASE_OUT }}
          className="overflow-hidden rounded-[14px] border border-bakery-border bg-bakery-surface shadow-sm"
        >
          <div className="relative aspect-[16/9] min-h-[190px] border-b border-bakery-border bg-bakery-subtle sm:aspect-[21/8]">
            <img
              src="img/hero-oven.jpg"
              width={1280}
              height={853}
              fetchPriority="high"
              decoding="async"
              alt="Выпекание горячих смаженок в каменной печи"
              className="h-full w-full object-cover"
              style={{ objectPosition: '50% 48%' }}
            />
            <div className="absolute bottom-3 left-3 right-3 z-10 w-fit max-w-[calc(100%-24px)] rounded-md border border-bakery-border bg-bakery-page/95 px-3 py-1.5 text-xs font-semibold text-bakery-ink sm:right-auto">
              Каменная печь 260 градусов: румяная корочка и сочная начинка
            </div>
          </div>

          <div className="grid grid-cols-1 divide-y divide-bakery-border md:grid-cols-3 md:divide-x md:divide-y-0" aria-label="Адреса точек в Могилёве">
            <a
              href="#location"
              className="flex flex-col gap-1 px-5 py-4 no-underline transition-colors hover:bg-bakery-subtle"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-sm font-bold text-bakery-ink">
                  ул. Челюскинцев, 37
                </span>
                <span className="whitespace-nowrap rounded-md bg-bakery-redSoft px-2 py-0.5 text-xs font-semibold text-bakery-red">
                  Основное кафе
                </span>
              </div>
              <span className="text-xs text-bakery-textMuted">
                Пн-Пт 09:00-21:00, Сб-Вс 10:00-20:00
              </span>
            </a>

            <a
              href="#location"
              className="flex flex-col gap-1 px-5 py-4 no-underline transition-colors hover:bg-bakery-subtle"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-sm font-bold text-bakery-ink">
                  ул. Строителей, 31
                </span>
                <span className="whitespace-nowrap rounded-md bg-bakery-redSoft px-2 py-0.5 text-xs font-semibold text-bakery-red">
                  Выдача навынос
                </span>
              </div>
              <span className="text-xs text-bakery-textMuted">Ежедневно 09:00-20:00</span>
            </a>

            <div className="flex flex-col gap-1 px-5 py-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-sm font-bold text-bakery-ink">
                  Доставка и термопакет
                </span>
                <span className="whitespace-nowrap rounded-md bg-bakery-goldSoft px-2 py-0.5 text-xs font-semibold text-bakery-goldInk">
                  от 20 BYN
                </span>
              </div>
              <span className="text-xs text-bakery-textMuted">
                Курьером по Могилёву 4 BYN, от 40 BYN бесплатно
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
