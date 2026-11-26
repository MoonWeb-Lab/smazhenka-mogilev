import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EMIL_EASE_OUT, SPRING_SNAPPY } from '../lib/motion';

const COOKIE_KEY = 'smazhenka_cookie_accepted';

interface CookieBannerProps {
  hasOrderTray: boolean;
}

export function CookieBanner({ hasOrderTray }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let accepted = false;
    try {
      accepted = localStorage.getItem(COOKIE_KEY) === 'true';
    } catch {
      accepted = false;
    }

    if (!accepted) {
      const timer = window.setTimeout(() => setVisible(true), 700);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_KEY, 'true');
    } catch {
      // localStorage unavailable
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          id="cookie-banner"
          role="region"
          aria-label="Уведомление об использовании файлов cookie"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.25, ease: EMIL_EASE_OUT }}
          className={`fixed left-3 right-3 z-30 rounded-[10px] border border-bakery-border bg-bakery-surface p-4 shadow-lg sm:left-4 sm:right-auto sm:max-w-[400px] ${
            hasOrderTray ? 'bottom-[88px]' : 'bottom-3 sm:bottom-4'
          }`}
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs leading-relaxed text-bakery-secondary">
              Мы используем cookie и локальное хранилище, чтобы сохранять состав корзины, выбранную точку или адрес доставки.
            </p>
            <div className="flex justify-end">
              <motion.button
                type="button"
                id="accept-cookies-btn"
                whileTap={{ scale: 0.96 }}
                transition={SPRING_SNAPPY}
                onClick={handleAccept}
                className="rounded-md bg-bakery-red px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-bakery-redHover"
              >
                Принять
              </motion.button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
