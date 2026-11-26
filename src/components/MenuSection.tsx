import { useState, type KeyboardEvent } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { CATEGORY_TABS, DISHES } from '../data/menuData';
import { EMIL_EASE_OUT, SPRING_SNAPPY } from '../lib/motion';
import type { DishCategory, DishItem } from '../types/menu';

interface MenuSectionProps {
  quantities: Record<string, number>;
  onAddItem: (dishId: string) => void;
  onUpdateQty: (dishId: string, delta: number) => void;
  onSelectDish: (dish: DishItem) => void;
}

export function MenuSection({
  quantities,
  onAddItem,
  onUpdateQty,
  onSelectDish,
}: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<DishCategory>('all');

  const visibleDishes =
    activeCategory === 'all'
      ? DISHES
      : DISHES.filter((dish) => dish.category === activeCategory);

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + dir + CATEGORY_TABS.length) % CATEGORY_TABS.length;
    setActiveCategory(CATEGORY_TABS[nextIndex].id);
    const nextBtn = e.currentTarget.parentElement?.children[nextIndex] as HTMLElement | undefined;
    nextBtn?.focus();
  };

  return (
    <section
      id="menu"
      className="border-b border-bakery-border bg-bakery-page py-12 sm:py-[72px]"
      aria-labelledby="menu-title"
    >
      <div className="mx-auto max-w-[1160px] px-4 sm:px-5 lg:px-6">
        <header className="mb-6 flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-bakery-red">
            Меню пекарни
          </span>
          <h2
            id="menu-title"
            className="font-display text-[clamp(1.6rem,2.2vw+0.7rem,2.35rem)] font-extrabold leading-tight tracking-[-0.025em] text-bakery-ink"
          >
            Свежие смаженки и напитки
          </h2>
          <p className="max-w-[56ch] text-base text-bakery-textMuted">
            Нажмите на блюдо, чтобы посмотреть полный состав и КБЖУ. Самовывоз и доставка доступны от 20.00 BYN.
          </p>
        </header>

        <div className="sticky top-16 z-10 -mx-4 mb-6 bg-bakery-page/90 px-4 py-2 backdrop-blur-md sm:-mx-5 sm:px-5 lg:-mx-6 lg:px-6">
          <LayoutGroup>
            <div
              className="no-scrollbar inline-flex max-w-full gap-1 overflow-x-auto rounded-[10px] border border-bakery-border bg-bakery-subtle p-1"
              role="tablist"
              aria-label="Категории меню"
            >
              {CATEGORY_TABS.map((tab, index) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-pressed={isActive}
                    data-category={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                    className={`menu-tab relative shrink-0 rounded-md px-3.5 py-2 text-sm transition-colors ${
                      isActive
                        ? 'is-active font-semibold text-bakery-ink'
                        : 'font-medium text-bakery-secondary hover:text-bakery-ink'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeMenuTab"
                        transition={SPRING_SNAPPY}
                        className="absolute inset-0 rounded-md border border-bakery-border bg-bakery-surface shadow-xs"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        <div className="menu-grid grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleDishes.map((dish, idx) => {
            const qty = quantities[dish.id] || 0;
            return (
              <motion.article
                key={dish.id}
                data-id={dish.id}
                data-category={dish.category}
                data-price={dish.price.toFixed(2)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.28,
                  delay: Math.min(idx * 0.025, 0.15),
                  ease: EMIL_EASE_OUT,
                }}
                whileHover={{ y: -2 }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('.item-btn') || target.closest('.stepper')) return;
                  onSelectDish(dish);
                }}
                className="menu-card group grid cursor-pointer grid-cols-[80px_minmax(0,1fr)] items-stretch gap-3 rounded-[10px] border border-bakery-border bg-bakery-surface p-3 transition-colors hover:border-bakery-borderStrong sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-4 sm:p-4"
              >
                <div className="menu-card-thumb aspect-square h-20 w-20 shrink-0 self-center overflow-hidden rounded-md bg-bakery-subtle sm:h-24 sm:w-24">
                  <img
                    src={dish.image}
                    alt={dish.alt}
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-105"
                  />
                </div>

                <div className="flex min-w-0 flex-col">
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <h3 className="font-display text-[1.0625rem] font-bold leading-snug text-bakery-ink sm:text-[1.15rem]">
                      <button
                        type="button"
                        onClick={() => onSelectDish(dish)}
                        className="menu-card-trigger border-0 bg-transparent p-0 text-left font-inherit text-inherit transition-colors group-hover:text-bakery-red"
                      >
                        {dish.name}
                      </button>
                    </h3>
                    {dish.badge && (
                      <span
                        className={`menu-badge text-[11px] font-bold uppercase tracking-wide ${
                          dish.badge.tone === 'red' ? 'text-bakery-red' : 'text-bakery-goldInk'
                        }`}
                      >
                        {dish.badge.label}
                      </span>
                    )}
                  </div>

                  <p className="menu-card-desc mb-3 flex-grow text-sm leading-snug text-bakery-textMuted">
                    {dish.shortDesc}
                  </p>

                  <div className="flex items-center justify-between gap-2 border-t border-bakery-border pt-2">
                    <div className="price-box flex items-baseline gap-2">
                      <span className="num font-display text-lg font-bold text-bakery-ink">
                        {dish.price.toFixed(2)} BYN
                      </span>
                      <span className="num text-xs text-bakery-textMuted">{dish.weight}</span>
                    </div>

                    {qty === 0 ? (
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        transition={SPRING_SNAPPY}
                        onClick={() => onAddItem(dish.id)}
                        aria-label={`Добавить ${dish.name} в корзину`}
                        className="item-btn inline-flex h-[34px] items-center justify-center rounded-md bg-bakery-red px-3.5 text-xs font-semibold text-white transition-colors hover:bg-bakery-redHover"
                      >
                        В корзину
                      </motion.button>
                    ) : (
                      <div
                        className="stepper inline-flex h-[34px] items-center gap-1 rounded-md border border-bakery-border bg-bakery-subtle p-0.5"
                        role="group"
                        aria-label={`Количество для ${dish.name}`}
                      >
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.92 }}
                          transition={SPRING_SNAPPY}
                          data-action="decrease"
                          onClick={() => onUpdateQty(dish.id, -1)}
                          aria-label={`Уменьшить ${dish.name}`}
                          className="stepper-btn relative flex h-7 w-7 items-center justify-center rounded bg-bakery-surface text-base font-bold text-bakery-ink transition-colors hover:bg-bakery-red hover:text-white"
                        >
                          -
                        </motion.button>
                        <span
                          className="stepper-count num min-w-[22px] text-center font-display text-xs font-bold text-bakery-ink"
                          aria-live="polite"
                        >
                          {qty}
                        </span>
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.92 }}
                          transition={SPRING_SNAPPY}
                          data-action="increase"
                          onClick={() => onUpdateQty(dish.id, 1)}
                          aria-label={`Увеличить ${dish.name}`}
                          className="stepper-btn relative flex h-7 w-7 items-center justify-center rounded bg-bakery-surface text-base font-bold text-bakery-ink transition-colors hover:bg-bakery-red hover:text-white"
                        >
                          +
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
