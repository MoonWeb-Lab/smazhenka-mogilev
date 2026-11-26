import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
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
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={CARD_VIEWPORT}
          transition={{ duration: 0.38, ease: EMIL_EASE_OUT }}
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
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING_SNAPPY}
            href={BAKERY_PHONE_HREF}
            className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-bakery-charcoal px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-bakery-charcoalHover sm:w-auto"
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, -8, 8, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 4.5, ease: 'easeInOut' }}
              className="inline-flex"
              aria-hidden="true"
            >
              <Phone className="h-4 w-4 text-bakery-amber" />
            </motion.span>
            <span>{BAKERY_PHONE_DISPLAY}</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
