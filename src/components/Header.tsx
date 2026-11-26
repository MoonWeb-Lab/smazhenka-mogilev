import { motion, useScroll, useSpring } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { BAKERY_INSTAGRAM_URL } from '../data/menuData';
import { SPRING_SNAPPY } from '../lib/motion';
import { InstagramIcon } from './InstagramIcon';

interface HeaderProps {
  totalCount: number;
  onOpenCart: () => void;
}

export function Header({ totalCount, onOpenCart }: HeaderProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <header className="sticky top-0 z-30 border-b border-bakery-border bg-bakery-page/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <motion.a
          whileHover={{ x: 1 }}
          whileTap={{ scale: 0.98 }}
          transition={SPRING_SNAPPY}
          href="#"
          className="flex shrink-0 items-center gap-2.5 text-bakery-ink no-underline"
          aria-label="Смаженка Могилёв на главную"
        >
          <span className="inline-flex shrink-0" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#161513" />
              <circle cx="16" cy="16" r="8.5" fill="#F7F5F0" />
              <circle cx="16" cy="16" r="5" fill="#D96B1B" />
            </svg>
          </span>
          <span className="font-display text-base font-extrabold tracking-tight text-bakery-ink sm:text-lg">
            Смаженка Могилёв
          </span>
        </motion.a>

        <nav aria-label="Основная навигация" className="hidden md:block">
          <ul className="flex list-none items-center gap-1 p-0">
            <li>
              <a
                href="#menu"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-bakery-secondary transition-colors hover:bg-bakery-subtle hover:text-bakery-ink"
              >
                Меню
              </a>
            </li>
            <li>
              <a
                href="#craft"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-bakery-secondary transition-colors hover:bg-bakery-subtle hover:text-bakery-ink"
              >
                Как печём
              </a>
            </li>
            <li>
              <a
                href="#location"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-bakery-secondary transition-colors hover:bg-bakery-subtle hover:text-bakery-ink"
              >
                Точки
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING_SNAPPY}
            href={BAKERY_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Инстаграм Смаженка Могилёв"
            className="inline-flex h-9 w-9 items-center justify-center gap-1.5 rounded-lg border border-bakery-border bg-bakery-surface text-xs font-semibold text-bakery-ink transition-colors hover:border-bakery-borderStrong hover:bg-bakery-subtle sm:w-auto sm:px-3"
          >
            <InstagramIcon className="h-4 w-4 shrink-0 text-bakery-amber" />
            <span className="hidden sm:inline">@smazhenka_mogilev</span>
          </motion.a>

          <motion.button
            type="button"
            id="open-cart-btn"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING_SNAPPY}
            onClick={onOpenCart}
            aria-label="Открыть корзину"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-bakery-charcoal px-3 text-xs font-semibold text-white transition-colors hover:bg-bakery-charcoalHover"
          >
            <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Корзина</span>
            <motion.span
              key={totalCount}
              initial={{ scale: 0.72, y: -2 }}
              animate={{ scale: 1, y: 0 }}
              transition={SPRING_SNAPPY}
              id="header-cart-badge"
              className="num inline-flex h-5 min-w-[20px] items-center justify-center rounded-md bg-bakery-amber px-1.5 text-xs font-bold leading-none text-white"
            >
              {totalCount}
            </motion.span>
          </motion.button>
        </div>
      </div>

      <motion.div
        style={{ scaleX }}
        className="h-[2px] w-full origin-left bg-bakery-amber"
        aria-hidden="true"
      />
    </header>
  );
}
