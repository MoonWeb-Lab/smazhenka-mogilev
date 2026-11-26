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
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <header className="mb-7 flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-bakery-amberInk">
            Меню пекарни
          </span>
          <h2
            id="menu-title"
            className="font-display text-[clamp(1.6rem,2.2vw+0.7rem,2.35rem)] font-extrabold leading-tight tracking-[-0.025em] text-bakery-ink"
          >
            Свежие смаженки и напитки
          </h2>
          <p className="max-w-[58ch] text-base text-bakery-textMuted">
            Нажмите на любое блюдо, чтобы увидеть полный состав и КБЖУ. Самовывоз и доставка доступны от 20.00 BYN.
          </p>
        </header>

        <div className="sticky top-16 z-10 -mx-4 mb-9 border-b border-bakery-border bg-bakery-page/90 px-4 py-2.5 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <LayoutGroup>
            <div
              className="no-scrollbar flex max-w-full gap-1 overflow-x-auto"
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
                    className={`menu-tab relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? 'is-active font-semibold text-white'
                        : 'font-medium text-bakery-secondary hover:bg-bakery-subtle hover:text-bakery-ink'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeMenuTab"
                        transition={SPRING_SNAPPY}
                        className="absolute inset-0 rounded-full bg-bakery-charcoal"
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

        <div className="menu-grid grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {visibleDishes.map((dish, idx) => {
            const qty = quantities[dish.id] || 0;
            return (
              <motion.article
                key={dish.id}
                data-id={dish.id}
                data-category={dish.category}
                data-price={dish.price.toFixed(2)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(idx * 0.025, 0.16),
                  ease: EMIL_EASE_OUT,
                }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('.item-btn') || target.closest('.stepper')) return;
                  onSelectDish(dish);
                }}
                className="menu-card group flex cursor-pointer flex-col"
              >
                <div className="menu-card-thumb aspect-[4/3] w-full overflow-hidden rounded-2xl bg-bakery-subtle">
                  <img
                    src={dish.image}
                    alt={dish.alt}
                    width={640}
                    height={480}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex flex-1 flex-col pt-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-bold leading-snug text-bakery-ink">
                      <button
                        type="button"
                        onClick={() => onSelectDish(dish)}
                        className="menu-card-trigger border-0 bg-transparent p-0 text-left font-inherit text-inherit transition-colors group-hover:text-bakery-amberInk"
                      >
                        {dish.name}
                      </button>
                    </h3>
                    {dish.badge && (
                      <span className="menu-badge shrink-0 text-[11px] font-bold uppercase tracking-wider text-bakery-amberInk">
                        {dish.badge.label}
                      </span>
                    )}
                  </div>

                  <p className="menu-card-desc mt-1.5 flex-grow text-sm leading-relaxed text-bakery-textMuted">
                    {dish.shortDesc}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-bakery-border pt-3">
                    <div className="price-box flex items-baseline gap-2">
                      <span className="num font-display text-lg font-extrabold text-bakery-ink">
                        {dish.price.toFixed(2)} BYN
                      </span>
                      <span className="num text-xs font-medium text-bakery-textMuted">
                        {dish.weight}
                      </span>
                    </div>

                    {qty === 0 ? (
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        transition={SPRING_SNAPPY}
                        onClick={() => onAddItem(dish.id)}
                        aria-label={`Добавить ${dish.name} в корзину`}
                        className="item-btn inline-flex h-9 items-center justify-center rounded-xl bg-bakery-charcoal px-4 text-xs font-semibold text-white transition-colors hover:bg-bakery-charcoalHover"
                      >
                        В корзину
                      </motion.button>
                    ) : (
                      <div
                        className="stepper inline-flex h-9 items-center gap-1.5"
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
                          className="stepper-btn flex h-8 w-8 items-center justify-center rounded-lg bg-bakery-subtle text-base font-bold text-bakery-ink transition-colors hover:bg-bakery-charcoal hover:text-white"
                        >
                          -
                        </motion.button>
                        <span
                          className="stepper-count num min-w-[22px] text-center font-display text-sm font-bold text-bakery-ink"
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
                          className="stepper-btn flex h-8 w-8 items-center justify-center rounded-lg bg-bakery-subtle text-base font-bold text-bakery-ink transition-colors hover:bg-bakery-charcoal hover:text-white"
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
