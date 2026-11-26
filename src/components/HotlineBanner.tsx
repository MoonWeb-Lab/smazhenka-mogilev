import { motion } from 'framer-motion';
import { BAKERY_PHONE_DISPLAY, BAKERY_PHONE_HREF } from '../data/menuData';
import { CARD_VIEWPORT, EMIL_EASE_OUT, SPRING_SNAPPY } from '../lib/motion';

export function HotlineBanner() {
  return (
    <section className="border-b border-bakery-border bg-bakery-page py-9" aria-labelledby="hotline-title">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-5 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={CARD_VIEWPORT}
          transition={{ duration: 0.36, ease: EMIL_EASE_OUT }}
          className="flex flex-col items-start justify-between gap-5 rounded-[10px] border border-bakery-border border-l-4 border-l-bakery-red bg-bakery-surface p-5 shadow-xs sm:flex-row sm:items-center sm:px-8 sm:py-6"
        >
          <div className="flex max-w-[58ch] flex-col gap-1">
            <h2 id="hotline-title" className="font-display text-xl font-bold text-bakery-ink">
              Спешите на пару или работу?
            </h2>
            <p className="text-sm text-bakery-textMuted">
              Позвоните за 10 минут до прихода. Снимем смаженки с противня и отложим ваш пакет на нужной точке.
            </p>
          </div>
          <motion.a
            whileTap={{ scale: 0.97 }}
            transition={SPRING_SNAPPY}
            href={BAKERY_PHONE_HREF}
            className="inline-flex w-full shrink-0 items-center justify-center rounded-md bg-bakery-red px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-bakery-redHover sm:w-auto"
          >
            {BAKERY_PHONE_DISPLAY}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
