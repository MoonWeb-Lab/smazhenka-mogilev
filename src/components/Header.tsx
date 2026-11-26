import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { BAKERY_INSTAGRAM_URL } from '../data/menuData';
import { SPRING_SNAPPY } from '../lib/motion';
import { InstagramIcon } from './InstagramIcon';

interface HeaderProps {
  totalCount: number;
  onOpenCart: () => void;
}

export function Header({ totalCount, onOpenCart }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-bakery-border bg-bakery-page/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1160px] items-center justify-between gap-4 px-4 sm:px-5 lg:px-6">
        <a
          href="#"
          className="flex shrink-0 items-center gap-3 text-bakery-ink no-underline"
          aria-label="Смаженка Могилёв на главную"
        >
          <span className="inline-flex shrink-0" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#D9381E" />
              <ellipse cx="16" cy="16.5" rx="10" ry="8.5" fill="#FFFDF8" />
              <ellipse cx="16" cy="16" rx="7" ry="5.5" fill="#E59A1C" />
              <circle cx="13.5" cy="14.5" r="1.6" fill="#D9381E" />
              <circle cx="18.5" cy="17" r="1.6" fill="#D9381E" />
            </svg>
          </span>
          <span className="flex items-baseline gap-2">
            <span className="font-display text-base font-extrabold tracking-tight text-bakery-ink sm:text-lg">
              СМАЖЕНКА
            </span>
            <span className="hidden text-xs font-semibold text-bakery-red sm:inline">
              Могилёв
            </span>
          </span>
        </a>

        <ul className="hidden list-none items-center gap-1 md:flex">
          <li>
            <a
              href="#menu"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-bakery-secondary transition-colors hover:bg-bakery-subtle hover:text-bakery-ink"
            >
              Меню
            </a>
          </li>
          <li>
            <a
              href="#craft"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-bakery-secondary transition-colors hover:bg-bakery-subtle hover:text-bakery-ink"
            >
              Как печём
            </a>
          </li>
          <li>
            <a
              href="#location"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-bakery-secondary transition-colors hover:bg-bakery-subtle hover:text-bakery-ink"
            >
              Точки
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <motion.a
            whileTap={{ scale: 0.97 }}
            transition={SPRING_SNAPPY}
            href={BAKERY_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Инстаграм Смаженка Могилёв"
            className="inline-flex h-9 w-9 items-center justify-center gap-1.5 rounded-md border border-bakery-border bg-bakery-surface text-xs font-semibold text-bakery-ink transition-colors hover:border-bakery-borderStrong hover:bg-bakery-subtle sm:w-auto sm:px-3"
          >
            <InstagramIcon className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">@smazhenka_mogilev</span>
          </motion.a>

          <motion.button
            type="button"
            id="open-cart-btn"
            whileTap={{ scale: 0.97 }}
            transition={SPRING_SNAPPY}
            onClick={onOpenCart}
            aria-label="Открыть корзину"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-bakery-border bg-bakery-surface px-3 text-xs font-semibold text-bakery-ink shadow-xs transition-colors hover:border-bakery-borderStrong hover:bg-bakery-subtle"
          >
            <ShoppingCart className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Корзина</span>
            <motion.span
              key={totalCount}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={SPRING_SNAPPY}
              id="header-cart-badge"
              className="num inline-flex h-5 min-w-[20px] items-center justify-center rounded-md bg-bakery-red px-1.5 text-xs font-bold leading-none text-white"
            >
              {totalCount}
            </motion.span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
