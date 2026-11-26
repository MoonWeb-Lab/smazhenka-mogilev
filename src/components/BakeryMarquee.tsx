import { motion } from 'framer-motion';

const MARQUEE_ITEMS = [
  'Каменная печь 260 градусов',
  'Опарное тесто на 3 часах расстойки',
  'Термопакет бесплатно к каждому заказу',
  'Могилёв: ул. Челюскинцев, 37 и ул. Строителей, 31',
  'Выпекаем свежими партиями весь день',
  'Доставка от 20 BYN, от 40 BYN бесплатно',
];

export function BakeryMarquee() {
  return (
    <div
      className="overflow-hidden border-b border-bakery-border bg-bakery-subtle py-3"
      aria-hidden="true"
    >
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex w-max items-center gap-6 whitespace-nowrap will-change-transform"
      >
        {[0, 1].map((dupIndex) => (
          <div key={dupIndex} className="flex items-center gap-6 pr-6">
            {MARQUEE_ITEMS.map((text) => (
              <span key={`${dupIndex}-${text}`} className="inline-flex items-center gap-6">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-bakery-secondary">
                  {text}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-bakery-amber" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
