import { motion } from 'framer-motion';
import { BAKERY_PHONE_DISPLAY, BAKERY_PHONE_HREF } from '../data/menuData';
import { CARD_VIEWPORT, EMIL_EASE_OUT, SPRING_SNAPPY } from '../lib/motion';

export function HotlineBanner() {
  return (
    <section
      className="border-b border-bakery-border bg-bakery-page py-10"
      aria-labelledby="hotline-title"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={CARD_VIEWPORT}
          transition={{ duration: 0.36, ease: EMIL_EASE_OUT }}
          className="flex flex-col items-start justify-between gap-5 border-l-4 border-bakery-amber pl-5 sm:flex-row sm:items-center"
        >
          <div className="flex max-w-[58ch] flex-col gap-1">
            <h2 id="hotline-title" className="font-display text-xl font-bold text-bakery-ink">
              Забегаете перед парой или работой?
            </h2>
            <p className="text-sm text-bakery-textMuted">
              Наберите нас за 10 минут до прихода. Снимем горячие смаженки с противня и отложим пакет на нужной точке.
            </p>
          </div>
          <motion.a
            whileTap={{ scale: 0.97 }}
            transition={SPRING_SNAPPY}
            href={BAKERY_PHONE_HREF}
            className="inline-flex w-full shrink-0 items-center justify-center rounded-xl bg-bakery-charcoal px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-bakery-charcoalHover sm:w-auto"
          >
            {BAKERY_PHONE_DISPLAY}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
