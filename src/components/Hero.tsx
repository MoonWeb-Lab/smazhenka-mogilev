import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BAKERY_PHONE_DISPLAY, BAKERY_PHONE_HREF } from '../data/menuData';
import { EMIL_EASE_OUT, HERO_ITEM, HERO_STAGGER, SPRING_SNAPPY } from '../lib/motion';
import { getMogilevBakeryStatus } from '../utils/bakeryHours';

const HERO_IMAGE = `${import.meta.env.BASE_URL}images/hero-oven.jpg`;

export function Hero() {
  const [status, setStatus] = useState(() => getMogilevBakeryStatus());
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.03, 1.09]);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 180, damping: 24 });
  const rotateY = useSpring(rawRotateY, { stiffness: 180, damping: 24 });

  const handlePhotoMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawRotateY.set(px * 5);
    rawRotateX.set(-py * 5);
  };

  const handlePhotoLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      setStatus(getMogilevBakeryStatus());
    }, 60000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="border-b border-bakery-border bg-bakery-page py-10 sm:py-16"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          <motion.div
            variants={HERO_STAGGER}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start gap-5"
          >
            <motion.div variants={HERO_ITEM} className="flex flex-wrap items-center gap-2.5">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-bakery-border bg-bakery-surface px-3 py-1 text-xs font-semibold text-bakery-ink"
                aria-live="polite"
              >
                <span className="relative flex h-2.5 w-2.5 items-center justify-center" aria-hidden="true">
                  <motion.span
                    animate={{ scale: [1, 2.1, 1], opacity: [0.65, 0, 0.65] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className={`absolute h-full w-full rounded-full ${
                      status.isOpen ? 'bg-bakery-success' : 'bg-bakery-amber'
                    }`}
                  />
                  <span
                    id="status-dot"
                    className={`relative h-2 w-2 rounded-full ${
                      status.isOpen ? 'bg-bakery-success' : 'bg-bakery-amber'
                    }`}
                  />
                </span>
                <span id="status-text">{status.label}</span>
              </div>
              <span className="inline-flex items-center rounded-full bg-bakery-amberSoft px-3 py-1 text-xs font-bold text-bakery-amberInk">
                Печём от 2.80 BYN
              </span>
            </motion.div>

            <motion.h1
              variants={HERO_ITEM}
              id="hero-title"
              className="font-display text-[clamp(2.2rem,3.8vw+0.8rem,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-bakery-ink"
            >
              Горячие могилёвские смаженки прямо из печи
            </motion.h1>

            <motion.p
              variants={HERO_ITEM}
              className="max-w-[54ch] text-base leading-relaxed text-bakery-secondary sm:text-lg"
            >
              Воздушное опарное тесто, много начинки и румяная сырная шапочка. Выпекаем свежие партии весь день на Челюскинцев и Строителей.
            </motion.p>

            <motion.div
              variants={HERO_ITEM}
              className="flex w-full flex-wrap items-center gap-3 pt-1 sm:w-auto"
            >
              <motion.a
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING_SNAPPY}
                href="#menu"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bakery-charcoal px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-bakery-charcoalHover sm:w-auto"
              >
                <span>Выбрать смаженку</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
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
            </motion.div>

            <motion.div
              variants={HERO_ITEM}
              className="mt-2 grid w-full grid-cols-1 gap-4 border-t border-bakery-border pt-5 sm:grid-cols-2"
              aria-label="Адреса пекарен в Могилёве"
            >
              <motion.a
                whileHover={{ x: 2 }}
                transition={SPRING_SNAPPY}
                href="#location"
                className="group flex flex-col gap-0.5 no-underline"
              >
                <span className="font-display text-sm font-bold text-bakery-ink transition-colors group-hover:text-bakery-amberInk">
                  ул. Челюскинцев, 37
                </span>
                <span className="text-xs text-bakery-textMuted">
                  Основное кафе: Пн-Пт 09:00-21:00, Сб-Вс 10:00-20:00
                </span>
              </motion.a>
              <motion.a
                whileHover={{ x: 2 }}
                transition={SPRING_SNAPPY}
                href="#location"
                className="group flex flex-col gap-0.5 no-underline"
              >
                <span className="font-display text-sm font-bold text-bakery-ink transition-colors group-hover:text-bakery-amberInk">
                  ул. Строителей, 31
                </span>
                <span className="text-xs text-bakery-textMuted">
                  Быстрая выдача навынос: ежедневно 09:00-20:00
                </span>
              </motion.a>
            </motion.div>
          </motion.div>

          <div
            onPointerMove={handlePhotoMove}
            onPointerLeave={handlePhotoLeave}
            style={{ perspective: 1000 }}
            className="w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EMIL_EASE_OUT }}
              style={{ rotateX, rotateY }}
              className="w-full overflow-hidden rounded-2xl bg-bakery-subtle will-change-transform"
            >
              <motion.img
                style={{ y: imageY, scale: imageScale, objectPosition: '50% 45%' }}
                src={HERO_IMAGE}
                width={1280}
                height={853}
                fetchPriority="high"
                decoding="async"
                alt="Выпекание горячих смаженок в каменной печи пекарни в Могилёве"
                className="aspect-[4/3] w-full object-cover will-change-transform lg:aspect-[5/4]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
