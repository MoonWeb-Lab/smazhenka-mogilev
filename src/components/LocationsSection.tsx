import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { BAKERY_PHONE_DISPLAY, BAKERY_PHONE_HREF, LOCATIONS } from '../data/menuData';
import { CARD_VIEWPORT, EMIL_EASE_OUT, SPRING_SNAPPY } from '../lib/motion';
import { getLocationStatus } from '../utils/bakeryHours';

export function LocationsSection() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="location"
      className="border-b border-bakery-border bg-bakery-page py-12 sm:py-[72px]"
      aria-labelledby="location-title"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={CARD_VIEWPORT}
          transition={{ duration: 0.38, ease: EMIL_EASE_OUT }}
          className="mb-8 flex flex-col gap-1.5"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-bakery-amberInk">
            Могилёв
          </span>
          <h2
            id="location-title"
            className="font-display text-[clamp(1.6rem,2.2vw+0.7rem,2.35rem)] font-extrabold leading-tight tracking-[-0.025em] text-bakery-ink"
          >
            Где забрать горячий заказ
          </h2>
        </motion.header>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {LOCATIONS.map((spot, idx) => {
            const spotStatus = getLocationStatus(spot.id, now);
            return (
              <motion.article
                key={spot.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={CARD_VIEWPORT}
                transition={{ duration: 0.42, delay: idx * 0.1, ease: EMIL_EASE_OUT }}
                className="group flex flex-col justify-between gap-5"
              >
                <div className="flex flex-col gap-3.5">
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-bakery-subtle">
                    <img
                      src={spot.image}
                      alt={spot.alt}
                      width={800}
                      height={500}
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <h3 className="font-display text-lg font-bold text-bakery-ink transition-colors group-hover:text-bakery-amberInk">
                      {spot.title}
                    </h3>
                    <span className="text-xs font-bold uppercase tracking-wide text-bakery-amberInk">
                      {spot.badge}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-bakery-secondary">
                    <span className="relative flex h-2.5 w-2.5 items-center justify-center" aria-hidden="true">
                      <motion.span
                        animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        className={`absolute h-full w-full rounded-full ${
                          spotStatus.isOpen ? 'bg-bakery-success' : 'bg-bakery-amber'
                        }`}
                      />
                      <span
                        className={`relative h-2 w-2 rounded-full ${
                          spotStatus.isOpen ? 'bg-bakery-success' : 'bg-bakery-amber'
                        }`}
                      />
                    </span>
                    <span>{spotStatus.label}</span>
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
                    <a href={BAKERY_PHONE_HREF} className="font-semibold text-bakery-amberInk underline">
                      {BAKERY_PHONE_DISPLAY}
                    </a>
                  </p>
                </div>

                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={SPRING_SNAPPY}
                  href={spot.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-bakery-border bg-bakery-surface px-4 py-3 text-sm font-semibold text-bakery-ink transition-colors hover:border-bakery-borderStrong hover:bg-bakery-subtle"
                >
                  <MapPin
                    className="h-4 w-4 text-bakery-amber transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  <span>Открыть на Яндекс Картах</span>
                </motion.a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
