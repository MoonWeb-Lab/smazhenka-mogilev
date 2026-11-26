import { BAKERY_INSTAGRAM_URL, BAKERY_PHONE_DISPLAY, BAKERY_PHONE_HREF } from '../data/menuData';
import { InstagramIcon } from './InstagramIcon';

interface FooterProps {
  hasOrderTray: boolean;
}

export function Footer({ hasOrderTray }: FooterProps) {
  return (
    <footer
      className={`border-t border-bakery-border bg-bakery-surface pt-14 ${
        hasOrderTray ? 'pb-28' : 'pb-9'
      }`}
    >
      <div className="mx-auto max-w-[1160px] px-4 sm:px-5 lg:px-6">
        <div className="mb-9 grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div className="flex flex-col gap-2">
            <span className="font-display text-xl font-extrabold text-bakery-ink">СМАЖЕНКА</span>
            <p className="max-w-[42ch] text-sm text-bakery-textMuted">
              Горячие смаженки из печи на ул. Челюскинцев, 37 и ул. Строителей, 31 в Могилёве.
            </p>
            <div className="mt-2">
              <a
                href={BAKERY_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-bakery-border bg-bakery-surface px-3 text-xs font-semibold text-bakery-ink transition-colors hover:border-bakery-borderStrong hover:bg-bakery-subtle"
                aria-label="Инстаграм Смаженка Могилёв"
              >
                <InstagramIcon className="h-3.5 w-3.5 shrink-0" />
                <span>@smazhenka_mogilev</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-bold text-bakery-ink">Навигация</h3>
            <ul className="flex list-none flex-col gap-1.5 p-0 text-sm text-bakery-secondary">
              <li>
                <a href="#menu" className="hover:text-bakery-red">
                  Меню
                </a>
              </li>
              <li>
                <a href="#craft" className="hover:text-bakery-red">
                  Как печём
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-bakery-red">
                  Точки в городе
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-bold text-bakery-ink">Контакты</h3>
            <ul className="flex list-none flex-col gap-1.5 p-0 text-sm text-bakery-secondary">
              <li>ул. Челюскинцев, 37</li>
              <li>ул. Строителей, 31</li>
              <li>
                <a href={BAKERY_PHONE_HREF} className="hover:text-bakery-red">
                  {BAKERY_PHONE_DISPLAY}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-bakery-border pt-4 text-xs text-bakery-textMuted">
          <span>© 2026 Смаженка Могилёв.</span>
          <div>
            Фотографии: архив{' '}
            <a
              href="https://commons.wikimedia.org/wiki/File:Pizza_baker_woman_stone_oven_2.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bakery-secondary underline"
            >
              Wikimedia Commons
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  );
}
