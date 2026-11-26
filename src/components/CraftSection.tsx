import { motion } from 'framer-motion';
import { CRAFT_STEPS } from '../data/menuData';
import { CARD_VIEWPORT, EMIL_EASE_OUT } from '../lib/motion';

export function CraftSection() {
  return (
    <section
      id="craft"
      className="border-b border-bakery-border bg-bakery-surface py-12 sm:py-[72px]"
      aria-labelledby="craft-title"
    >
      <div className="mx-auto max-w-[1160px] px-4 sm:px-5 lg:px-6">
        <header className="mb-6 flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-bakery-red">
            Пекарня
          </span>
          <h2
            id="craft-title"
            className="font-display text-[clamp(1.6rem,2.2vw+0.7rem,2.35rem)] font-extrabold leading-tight tracking-[-0.025em] text-bakery-ink"
          >
            Как получаются наши смаженки
          </h2>
          <p className="max-w-[56ch] text-base text-bakery-textMuted">
            Три простых правила, которых мы держимся каждый день на обеих точках.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CRAFT_STEPS.map((step, idx) => (
            <motion.article
              key={step.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={CARD_VIEWPORT}
              transition={{ duration: 0.36, delay: idx * 0.06, ease: EMIL_EASE_OUT }}
              className="rounded-[10px] border border-bakery-border bg-bakery-page p-6"
            >
              <div className="num mb-2 font-display text-[1.75rem] font-extrabold text-bakery-gold">
                {step.num}
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-bakery-ink">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-bakery-textMuted">{step.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
