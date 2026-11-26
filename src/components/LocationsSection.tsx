import { motion } from 'framer-motion';
import { BAKERY_PHONE_DISPLAY, BAKERY_PHONE_HREF, LOCATIONS } from '../data/menuData';
import { CARD_VIEWPORT, EMIL_EASE_OUT, SPRING_SNAPPY } from '../lib/motion';

export function LocationsSection() {
  return (
    <section
      id="location"
      className="border-b border-bakery-border bg-bakery-page py-12 sm:py-[72px]"
      aria-labelledby="location-title"
    >
      <div className="mx-auto max-w-[1160px] px-4 sm:px-5 lg:px-6">
        <header className="mb-6 flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-bakery-red">
            Могилёв
          </span>
          <h2
            id="location-title"
            className="font-display text-[clamp(1.6rem,2.2vw+0.7rem,2.35rem)] font-extrabold leading-tight tracking-[-0.025em] text-bakery-ink"
          >
            Где забрать заказ
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {LOCATIONS.map((spot, idx) => (
            <motion.article
              key={spot.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={CARD_VIEWPORT}
              transition={{ duration: 0.36, delay: idx * 0.08, ease: EMIL_EASE_OUT }}
              className="flex flex-col justify-between gap-4 rounded-[14px] border border-bakery-border bg-bakery-surface p-6 shadow-xs"
            >
              <div className="flex flex-col gap-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] border border-bakery-border bg-bakery-subtle p-2">
                  <img
                    src={spot.image}
                    alt={spot.alt}
                    width={200}
                    height={130}
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                  <span className="absolute bottom-2 right-2 z-10 rounded-md border border-bakery-border bg-bakery-surface px-2.5 py-1 text-xs font-bold text-bakery-ink shadow-xs">
                    {spot.rating}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-bakery-ink">
                    {spot.title}
                  </h3>
                  <span className="rounded-md bg-bakery-goldSoft px-2.5 py-1 text-xs font-semibold text-bakery-goldInk">
                    {spot.badge}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-bakery-textMuted">{spot.description}</p>

                <table className="w-full border-collapse text-sm">
                  <tbody>
                    {spot.hours.map((row) => (
                      <tr key={row.days} className="border-b border-bakery-border last:border-b-0">
                        <td className="py-2 font-medium text-bakery-secondary">{row.days}</td>
                        <td className="num py-2 text-right font-semibold text-bakery-ink">
                          {row.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="text-sm text-bakery-secondary">
                  Телефон:{' '}
                  <a href={BAKERY_PHONE_HREF} className="font-semibold text-bakery-red underline">
                    {BAKERY_PHONE_DISPLAY}
                  </a>
                </p>
              </div>

              <motion.a
                whileTap={{ scale: 0.97 }}
                transition={SPRING_SNAPPY}
                href={spot.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-md border border-bakery-border bg-bakery-surface px-4 py-2.5 text-sm font-semibold text-bakery-ink transition-colors hover:border-bakery-borderStrong hover:bg-bakery-subtle"
              >
                Открыть на Яндекс Картах
              </motion.a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
