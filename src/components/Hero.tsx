import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BAKERY_PHONE_DISPLAY, BAKERY_PHONE_HREF } from '../data/menuData';
import { EMIL_EASE_OUT, SPRING_SNAPPY } from '../lib/motion';
import { getMogilevBakeryStatus } from '../utils/bakeryHours';

const HERO_IMAGE = `${import.meta.env.BASE_URL}images/hero-oven.jpg`;

export function Hero() {
  const [status, setStatus] = useState(() => getMogilevBakeryStatus());

  useEffect(() => {
    const id = window.setInterval(() => {
      setStatus(getMogilevBakeryStatus());
    }, 60000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="hero"
      className="border-b border-bakery-border bg-bakery-page py-10 sm:py-16"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EMIL_EASE_OUT }}
            className="flex flex-col items-start gap-5"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-bakery-border bg-bakery-surface px-3 py-1 text-xs font-semibold text-bakery-ink"
                aria-live="polite"
              >
                <span
                  id="status-dot"
                  className={`h-2 w-2 rounded-full ${
                    status.isOpen ? 'bg-bakery-success' : 'bg-bakery-amber'
                  }`}
                  aria-hidden="true"
                />
                <span id="status-text">{status.label}</span>
              </div>
              <span className="inline-flex items-center rounded-full bg-bakery-amberSoft px-3 py-1 text-xs font-bold text-bakery-amberInk">
                Печём от 2.80 BYN
              </span>
            </div>

            <h1
              id="hero-title"
              className="font-display text-[clamp(2.2rem,3.8vw+0.8rem,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-bakery-ink"
            >
              Горячие могилёвские смаженки прямо из печи
            </h1>

            <p className="max-w-[54ch] text-base leading-relaxed text-bakery-secondary sm:text-lg">
              Воздушное опарное тесто, много начинки и румяная сырная шапочка. Выпекаем свежие партии весь день на Челюскинцев и Строителей.
            </p>

            <div className="flex w-full flex-wrap items-center gap-3 pt-1 sm:w-auto">
              <motion.a
                whileTap={{ scale: 0.97 }}
                transition={SPRING_SNAPPY}
                href="#menu"
                className="inline-flex w-full items-center justify-center rounded-xl bg-bakery-charcoal px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-bakery-charcoalHover sm:w-auto"
              >
                Выбрать смаженку
              </motion.a>
              <motion.a
                whileTap={{ scale: 0.97 }}
                transition={SPRING_SNAPPY}
                href="#location"
                className="inline-flex w-full items-center justify-center rounded-xl border border-bakery-border bg-bakery-surface px-5 py-3.5 text-sm font-semibold text-bakery-ink transition-colors hover:border-bakery-borderStrong hover:bg-bakery-subtle sm:w-auto"
              >
                Адреса точек
              </motion.a>
              <a
                href={BAKERY_PHONE_HREF}
                className="inline-flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold text-bakery-secondary transition-colors hover:text-bakery-amberInk sm:w-auto"
              >
                {BAKERY_PHONE_DISPLAY}
              </a>
            </div>

            <div
              className="mt-2 grid w-full grid-cols-1 gap-4 border-t border-bakery-border pt-5 sm:grid-cols-2"
              aria-label="Адреса пекарен в Могилёве"
            >
              <a href="#location" className="group flex flex-col gap-0.5 no-underline">
                <span className="font-display text-sm font-bold text-bakery-ink transition-colors group-hover:text-bakery-amberInk">
                  ул. Челюскинцев, 37
                </span>
                <span className="text-xs text-bakery-textMuted">
                  Основное кафе: Пн-Пт 09:00-21:00, Сб-Вс 10:00-20:00
                </span>
              </a>
              <a href="#location" className="group flex flex-col gap-0.5 no-underline">
                <span className="font-display text-sm font-bold text-bakery-ink transition-colors group-hover:text-bakery-amberInk">
                  ул. Строителей, 31
                </span>
                <span className="text-xs text-bakery-textMuted">
                  Быстрая выдача навынос: ежедневно 09:00-20:00
                </span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: EMIL_EASE_OUT }}
            className="w-full"
          >
            <img
              src={HERO_IMAGE}
              width={1280}
              height={853}
              fetchPriority="high"
              decoding="async"
              alt="Выпекание горячих смаженок в каменной печи пекарни в Могилёве"
              className="aspect-[4/3] w-full rounded-2xl object-cover lg:aspect-[5/4]"
              style={{ objectPosition: '50% 45%' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
