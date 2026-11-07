/**
 * Смаженка Могилёв — Клиентский интерактив, корзина и калькулятор заказа
 * Чистый Vanilla JS без фреймворков
 */

document.documentElement.classList.add('js');

(function() {
  'use strict';

  // Минимальная сумма заказа для оформления
  const MIN_ORDER_AMOUNT = 20.00;

  // Состояние корзины
  const cart = {
    items: {},
    totalCount: 0,
    totalPrice: 0
  };

  // 1. Инициализация таймера свежей партии и статуса работы печи
  function initOvenStatus() {
    const statusTextEl = document.getElementById('status-text');
    const batchTimerEl = document.getElementById('batch-timer');

    function updateStatus() {
      // Время по Могилёву (UTC+3)
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const mogilevTime = new Date(utc + (3600000 * 3));
      
      const hours = mogilevTime.getHours();
      const minutes = mogilevTime.getMinutes();
      const seconds = mogilevTime.getSeconds();

      // Режим работы: 08:00 до 21:00
      const isOpen = hours >= 8 && hours < 21;

      if (statusTextEl) {
        if (isOpen) {
          statusTextEl.textContent = 'Печь горячая, открыто до 21:00';
        } else {
          statusTextEl.textContent = 'Откроется в 08:00';
        }
      }

      if (batchTimerEl) {
        if (isOpen) {
          // 15-минутный цикл выпекания
          const cycleMinutes = 15;
          const minsInCycle = minutes % cycleMinutes;
          const minsRemaining = cycleMinutes - 1 - minsInCycle;
          const secsRemaining = 60 - seconds;
          
          const formattedMins = String(minsRemaining).padStart(2, '0');
          const formattedSecs = String(secsRemaining === 60 ? 0 : secsRemaining).padStart(2, '0');

          batchTimerEl.textContent = `${formattedMins}:${formattedSecs}`;
        } else {
          batchTimerEl.textContent = 'утром в 08:15';
        }
      }
    }

    updateStatus();
    setInterval(updateStatus, 1000);
  }

  // 2. Интерактивная фильтрация категорий меню
  function initMenuFilters() {
    const filterChips = document.querySelectorAll('.filter-chip');
    const menuCards = document.querySelectorAll('.menu-card');

    if (!filterChips.length || !menuCards.length) return;

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const selectedCategory = chip.getAttribute('data-category');

        filterChips.forEach(c => {
          c.classList.remove('is-active');
          c.setAttribute('aria-pressed', 'false');
        });

        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');

        menuCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          const isMatch = selectedCategory === 'all' || cardCategory === selectedCategory;

          if (isMatch) {
            card.removeAttribute('hidden');
          } else {
            card.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  // 3. Корзина, калькулятор и минимальный заказ от 20 BYN
  function initCartAndOrder() {
    const menuGrid = document.querySelector('.menu-grid');
    const orderTray = document.querySelector('.order-tray');
    const trayCountEl = document.getElementById('tray-count-text');
    const trayTotalEl = document.getElementById('tray-total-text');
    const trayResetBtn = document.getElementById('tray-reset-btn');
    const trayOpenCartBtn = document.getElementById('tray-open-cart-btn');

    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const cartDrawer = document.getElementById('cart-drawer');
    const headerCartBadge = document.getElementById('header-cart-badge');

    const cartItemsList = document.getElementById('cart-items-list');
    const cartEmptyState = document.getElementById('cart-empty-state');
    const cartProgressBar = document.getElementById('cart-progress-bar');
    const cartProgressStatus = document.getElementById('cart-progress-status');
    const cartSubtotalVal = document.getElementById('cart-subtotal-val');
    const cartTotalVal = document.getElementById('cart-total-val');
    const checkoutSubmitBtn = document.getElementById('checkout-submit-btn');
    const checkoutBtnText = document.getElementById('checkout-btn-text');
    const checkoutForm = document.getElementById('cart-checkout-form');
    const orderSuccessMsg = document.getElementById('order-success-message');

    // Открытие и закрытие модальной корзины
    function openCart() {
      if (!cartDrawer || !cartBackdrop) return;
      cartDrawer.classList.add('is-open');
      cartBackdrop.classList.add('is-open');
      cartDrawer.setAttribute('aria-hidden', 'false');
      cartBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKeyDown);
    }

    function closeCart() {
      if (!cartDrawer || !cartBackdrop) return;
      cartDrawer.classList.remove('is-open');
      cartBackdrop.classList.remove('is-open');
      cartDrawer.setAttribute('aria-hidden', 'true');
      cartBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        closeCart();
      }
    }

    if (openCartBtn) openCartBtn.addEventListener('click', openCart);
    if (trayOpenCartBtn) trayOpenCartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

    // Склонение существительных
    function getRussianPlural(n, forms) {
      n = Math.abs(n) % 100;
      const n1 = n % 10;
      if (n > 10 && n < 20) return forms[2];
      if (n1 > 1 && n1 < 5) return forms[1];
      if (n1 === 1) return forms[0];
      return forms[2];
    }

    // Полный пересчет калькулятора и обновление всех компонентов интерфейса
    function updateAllUI() {
      let count = 0;
      let total = 0;

      for (const id in cart.items) {
        const item = cart.items[id];
        count += item.qty;
        total += item.qty * item.price;
      }

      cart.totalCount = count;
      cart.totalPrice = total;

      // 1. Шапка сайта
      if (headerCartBadge) {
        headerCartBadge.textContent = count;
      }

      // 2. Плавающая нижняя панель (мобильная)
      if (orderTray) {
        if (count > 0) {
          orderTray.classList.add('is-visible');
          if (trayCountEl) {
            const word = getRussianPlural(count, ['позиция', 'позиции', 'позиций']);
            trayCountEl.textContent = `В заказе: ${count} ${word}`;
          }
          if (trayTotalEl) {
            trayTotalEl.textContent = `${total.toFixed(2)} BYN`;
          }
        } else {
          orderTray.classList.remove('is-visible');
        }
      }

      // 3. Калькулятор корзины
      if (cartSubtotalVal) cartSubtotalVal.textContent = `${total.toFixed(2)} BYN`;
      if (cartTotalVal) cartTotalVal.textContent = `${total.toFixed(2)} BYN`;

      // 4. Прогресс минимального заказа (20.00 BYN)
      const diff = MIN_ORDER_AMOUNT - total;
      const progressRatio = Math.min(1, total / MIN_ORDER_AMOUNT);

      if (cartProgressBar) {
        cartProgressBar.style.transform = `scaleX(${progressRatio})`;
      }

      if (diff > 0) {
        if (cartProgressStatus) {
          cartProgressStatus.textContent = `До минимального заказа осталось: ${diff.toFixed(2)} BYN`;
          cartProgressStatus.classList.remove('is-complete');
        }
        if (cartProgressBar) cartProgressBar.classList.remove('is-complete');
        if (checkoutSubmitBtn) {
          checkoutSubmitBtn.disabled = true;
          checkoutSubmitBtn.setAttribute('aria-disabled', 'true');
        }
        if (checkoutBtnText) {
          checkoutBtnText.textContent = `Добавьте еще на ${diff.toFixed(2)} BYN (минимум 20)`;
        }
      } else {
        if (cartProgressStatus) {
          cartProgressStatus.textContent = 'Минимальный заказ набран! Можно оформлять.';
          cartProgressStatus.classList.add('is-complete');
        }
        if (cartProgressBar) cartProgressBar.classList.add('is-complete');
        if (checkoutSubmitBtn) {
          checkoutSubmitBtn.disabled = false;
          checkoutSubmitBtn.removeAttribute('aria-disabled');
        }
        if (checkoutBtnText) {
          checkoutBtnText.textContent = `Оформить заказ на ${total.toFixed(2)} BYN`;
        }
      }

      // 5. Рендеринг позиций в корзине
      renderCartDrawerItems();

      // 6. Синхронизация кнопок и степперов в карточках меню
      syncMenuCardsUI();
    }

    // Отрисовка элементов в корзине
    function renderCartDrawerItems() {
      if (!cartItemsList) return;

      const itemIds = Object.keys(cart.items);

      if (itemIds.length === 0) {
        cartItemsList.innerHTML = `
          <div class="cart-empty-state" id="cart-empty-state">
            <p class="cart-empty-text">В корзине пока пусто</p>
            <p class="cart-empty-sub">Выберите горячие смаженки или напитки в меню</p>
          </div>
        `;
        return;
      }

      let html = '';
      for (const id of itemIds) {
        const item = cart.items[id];
        const subtotal = (item.qty * item.price).toFixed(2);
        html += `
          <div class="cart-item-row" data-id="${id}">
            <div class="cart-item-info">
              <span class="cart-item-name">${item.name}</span>
              <span class="cart-item-price num">${item.price.toFixed(2)} BYN за шт</span>
            </div>
            <div class="stepper" role="group" aria-label="Количество для ${item.name}">
              <button type="button" class="stepper-btn" data-action="decrease" aria-label="Уменьшить">−</button>
              <span class="stepper-count" aria-live="polite">${item.qty}</span>
              <button type="button" class="stepper-btn" data-action="increase" aria-label="Увеличить">+</button>
            </div>
            <span class="cart-item-subtotal">${subtotal} BYN</span>
          </div>
        `;
      }

      cartItemsList.innerHTML = html;
    }

    // Синхронизация карточек меню со стейтом корзины
    function syncMenuCardsUI() {
      document.querySelectorAll('.menu-card').forEach(card => {
        const id = card.getAttribute('data-id');
        const addBtn = card.querySelector('.item-btn');
        let stepper = card.querySelector('.stepper');

        if (cart.items[id] && cart.items[id].qty > 0) {
          if (addBtn) addBtn.style.display = 'none';
          if (!stepper) {
            const bottomBox = card.querySelector('.menu-card-bottom');
            stepper = document.createElement('div');
            stepper.className = 'stepper';
            stepper.setAttribute('role', 'group');
            stepper.setAttribute('aria-label', `Количество для ${cart.items[id].name}`);
            stepper.innerHTML = `
              <button type="button" class="stepper-btn" data-action="decrease" aria-label="Уменьшить">−</button>
              <span class="stepper-count" aria-live="polite">${cart.items[id].qty}</span>
              <button type="button" class="stepper-btn" data-action="increase" aria-label="Увеличить">+</button>
            `;
            bottomBox.appendChild(stepper);
          } else {
            stepper.style.display = 'inline-flex';
            stepper.querySelector('.stepper-count').textContent = cart.items[id].qty;
          }
        } else {
          if (addBtn) addBtn.style.display = 'inline-flex';
          if (stepper) stepper.style.display = 'none';
        }
      });
    }

    // Клик по кнопкам карточек меню
    if (menuGrid) {
      menuGrid.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.item-btn');
        const stepBtn = e.target.closest('.stepper-btn');

        if (addBtn) {
          const card = addBtn.closest('.menu-card');
          const id = card.getAttribute('data-id');
          const price = parseFloat(card.getAttribute('data-price') || '0');
          const name = card.querySelector('.menu-card-name')?.textContent || '';

          cart.items[id] = { qty: 1, price, name };
          updateAllUI();
        }

        if (stepBtn) {
          const card = stepBtn.closest('.menu-card');
          const id = card.getAttribute('data-id');
          const action = stepBtn.getAttribute('data-action');

          if (!cart.items[id]) return;

          if (action === 'increase') {
            cart.items[id].qty += 1;
          } else if (action === 'decrease') {
            cart.items[id].qty -= 1;
            if (cart.items[id].qty <= 0) {
              delete cart.items[id];
            }
          }

          updateAllUI();
        }
      });
    }

    // Клик по кнопкам изменения количества внутри корзины
    if (cartItemsList) {
      cartItemsList.addEventListener('click', (e) => {
        const stepBtn = e.target.closest('.stepper-btn');
        if (!stepBtn) return;

        const row = stepBtn.closest('.cart-item-row');
        const id = row.getAttribute('data-id');
        const action = stepBtn.getAttribute('data-action');

        if (!cart.items[id]) return;

        if (action === 'increase') {
          cart.items[id].qty += 1;
        } else if (action === 'decrease') {
          cart.items[id].qty -= 1;
          if (cart.items[id].qty <= 0) {
            delete cart.items[id];
          }
        }

        updateAllUI();
      });
    }

    // Очистка корзины
    if (trayResetBtn) {
      trayResetBtn.addEventListener('click', () => {
        cart.items = {};
        updateAllUI();
      });
    }

    // Отправка заказа (чек-аут)
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (cart.totalPrice < MIN_ORDER_AMOUNT) {
          return;
        }

        const nameInput = document.getElementById('order-name');
        const phoneInput = document.getElementById('order-phone');

        if (!nameInput.value.trim() || !phoneInput.value.trim()) {
          if (!nameInput.value.trim()) nameInput.focus();
          else phoneInput.focus();
          return;
        }

        checkoutForm.style.display = 'none';
        if (orderSuccessMsg) orderSuccessMsg.removeAttribute('hidden');

        setTimeout(() => {
          cart.items = {};
          updateAllUI();
          if (orderSuccessMsg) orderSuccessMsg.setAttribute('hidden', '');
          checkoutForm.reset();
          checkoutForm.style.display = 'flex';
          closeCart();
        }, 4000);
      });
    }
  }

  // 4. Плавный скролл к якорям с учетом липкого заголовка
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 64;
          const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Запуск при готовности DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initOvenStatus();
      initMenuFilters();
      initCartAndOrder();
      initSmoothScroll();
    });
  } else {
    initOvenStatus();
    initMenuFilters();
    initCartAndOrder();
    initSmoothScroll();
  }
})();
