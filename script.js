/**
 * Смаженка Могилёв: Клиентский интерактив, корзина, доставка и калькулятор заказа
 * Чистый Vanilla JS без фреймворков
 */

document.documentElement.classList.add('js');

(function() {
  'use strict';

  // Минимальная сумма заказа для оформления
  const MIN_ORDER_AMOUNT = 20.00;
  // Стоимость доставки курьером
  const DELIVERY_FEE = 4.00;
  // Порог бесплатной доставки
  const FREE_DELIVERY_THRESHOLD = 40.00;

  // Состояние корзины
  const cart = {
    items: {},
    totalCount: 0,
    subtotal: 0,
    totalPrice: 0
  };

  // Способ получения заказа: 'pickup' (самовывоз) или 'delivery' (доставка курьером)
  let deliveryMethod = 'pickup';

  // 1. Инициализация таймера свежей партии и статуса работы печи
  function initOvenStatus() {
    const statusTextEl = document.getElementById('status-text');
    const batchTimerEl = document.getElementById('batch-timer');

    function updateStatus() {
      // Время по Могилёву (UTC+3)
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const mogilevTime = new Date(utc + (3600000 * 3));
      
      const day = mogilevTime.getDay(); // 0: вс, 6: сб
      const isWeekend = day === 0 || day === 6;
      const hours = mogilevTime.getHours();
      const minutes = mogilevTime.getMinutes();
      const seconds = mogilevTime.getSeconds();

      // Режим работы: будни 09:00 до 21:00, выходные 10:00 до 20:00
      const openHour = isWeekend ? 10 : 9;
      const closeHour = isWeekend ? 20 : 21;
      const isOpen = hours >= openHour && hours < closeHour;

      if (statusTextEl) {
        if (isOpen) {
          statusTextEl.textContent = `Печи горячие, открыто до ${closeHour}:00`;
        } else {
          statusTextEl.textContent = `Откроется в ${openHour}:00`;
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
          batchTimerEl.textContent = `утром в ${openHour}:15`;
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

  // 3. Корзина, калькулятор и заказ с доставкой / самовывозом
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
    const cartProgressBar = document.getElementById('cart-progress-bar');
    const cartProgressStatus = document.getElementById('cart-progress-status');
    const cartSubtotalVal = document.getElementById('cart-subtotal-val');
    const cartDeliveryLabel = document.getElementById('cart-delivery-label');
    const cartDeliveryVal = document.getElementById('cart-delivery-val');
    const cartTotalVal = document.getElementById('cart-total-val');
    const checkoutSubmitBtn = document.getElementById('checkout-submit-btn');
    const checkoutBtnText = document.getElementById('checkout-btn-text');
    const checkoutForm = document.getElementById('cart-checkout-form');
    const orderSuccessMsg = document.getElementById('order-success-message');
    const orderSuccessText = document.getElementById('order-success-text');

    // Переключатель способа получения
    const methodPickupBtn = document.getElementById('method-pickup-btn');
    const methodDeliveryBtn = document.getElementById('method-delivery-btn');
    const pickupFields = document.getElementById('pickup-fields');
    const deliveryFields = document.getElementById('delivery-fields');
    const orderConsent = document.getElementById('order-consent');
    const orderStreet = document.getElementById('order-street');

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

    // Переключение способа получения (самовывоз или доставка курьером)
    function setDeliveryMethod(method) {
      deliveryMethod = method;
      if (method === 'delivery') {
        if (methodDeliveryBtn) {
          methodDeliveryBtn.classList.add('is-active');
          methodDeliveryBtn.setAttribute('aria-checked', 'true');
        }
        if (methodPickupBtn) {
          methodPickupBtn.classList.remove('is-active');
          methodPickupBtn.setAttribute('aria-checked', 'false');
        }
        if (pickupFields) pickupFields.hidden = true;
        if (deliveryFields) deliveryFields.hidden = false;
      } else {
        if (methodPickupBtn) {
          methodPickupBtn.classList.add('is-active');
          methodPickupBtn.setAttribute('aria-checked', 'true');
        }
        if (methodDeliveryBtn) {
          methodDeliveryBtn.classList.remove('is-active');
          methodDeliveryBtn.setAttribute('aria-checked', 'false');
        }
        if (pickupFields) pickupFields.hidden = false;
        if (deliveryFields) deliveryFields.hidden = true;
      }
      updateAllUI();
    }

    if (methodPickupBtn) {
      methodPickupBtn.addEventListener('click', () => setDeliveryMethod('pickup'));
    }
    if (methodDeliveryBtn) {
      methodDeliveryBtn.addEventListener('click', () => setDeliveryMethod('delivery'));
    }
    if (orderConsent) {
      orderConsent.addEventListener('change', updateAllUI);
    }

    // Полный пересчет калькулятора и обновление всех компонентов интерфейса
    function updateAllUI() {
      let count = 0;
      let foodSubtotal = 0;

      for (const id in cart.items) {
        const item = cart.items[id];
        count += item.qty;
        foodSubtotal += item.qty * item.price;
      }

      cart.totalCount = count;
      cart.subtotal = foodSubtotal;

      // Расчет доставки
      let currentDeliveryFee = 0;
      if (deliveryMethod === 'delivery') {
        if (foodSubtotal >= FREE_DELIVERY_THRESHOLD) {
          currentDeliveryFee = 0;
          if (cartDeliveryLabel) cartDeliveryLabel.textContent = 'Доставка курьером:';
          if (cartDeliveryVal) {
            cartDeliveryVal.textContent = 'Бесплатно (заказ от 40 BYN)';
            cartDeliveryVal.className = 'cart-free-tag';
          }
        } else {
          currentDeliveryFee = DELIVERY_FEE;
          if (cartDeliveryLabel) cartDeliveryLabel.textContent = 'Доставка курьером:';
          if (cartDeliveryVal) {
            cartDeliveryVal.textContent = `${DELIVERY_FEE.toFixed(2)} BYN`;
            cartDeliveryVal.className = 'num';
          }
        }
      } else {
        currentDeliveryFee = 0;
        if (cartDeliveryLabel) cartDeliveryLabel.textContent = 'Самовывоз:';
        if (cartDeliveryVal) {
          cartDeliveryVal.textContent = 'Бесплатно';
          cartDeliveryVal.className = 'cart-free-tag';
        }
      }

      const orderTotal = count > 0 ? (foodSubtotal + currentDeliveryFee) : 0;
      cart.totalPrice = orderTotal;

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
            trayTotalEl.textContent = `${orderTotal.toFixed(2)} BYN`;
          }
        } else {
          orderTray.classList.remove('is-visible');
        }
      }

      // 3. Калькулятор корзины
      if (cartSubtotalVal) cartSubtotalVal.textContent = `${foodSubtotal.toFixed(2)} BYN`;
      if (cartTotalVal) cartTotalVal.textContent = `${orderTotal.toFixed(2)} BYN`;

      // 4. Прогресс минимального заказа (20.00 BYN)
      const diff = MIN_ORDER_AMOUNT - foodSubtotal;
      const progressRatio = Math.min(1, foodSubtotal / MIN_ORDER_AMOUNT);

      if (cartProgressBar) {
        cartProgressBar.style.transform = `scaleX(${progressRatio})`;
      }

      const isConsentGiven = !orderConsent || orderConsent.checked;

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
      } else if (!isConsentGiven) {
        if (cartProgressStatus) {
          cartProgressStatus.textContent = 'Подтвердите согласие на обработку персональных данных';
          cartProgressStatus.classList.remove('is-complete');
        }
        if (checkoutSubmitBtn) {
          checkoutSubmitBtn.disabled = true;
          checkoutSubmitBtn.setAttribute('aria-disabled', 'true');
        }
        if (checkoutBtnText) {
          checkoutBtnText.textContent = 'Требуется согласие на обработку данных';
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
          checkoutBtnText.textContent = `Оформить заказ на ${orderTotal.toFixed(2)} BYN`;
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

        if (cart.subtotal < MIN_ORDER_AMOUNT) {
          return;
        }

        if (orderConsent && !orderConsent.checked) {
          orderConsent.focus();
          return;
        }

        const nameInput = document.getElementById('order-name');
        const phoneInput = document.getElementById('order-phone');

        if (!nameInput.value.trim()) {
          nameInput.focus();
          return;
        }

        if (!phoneInput.value.trim()) {
          phoneInput.focus();
          return;
        }

        if (deliveryMethod === 'delivery') {
          if (!orderStreet || !orderStreet.value.trim()) {
            if (orderStreet) orderStreet.focus();
            return;
          }
        }

        if (orderSuccessText) {
          if (deliveryMethod === 'delivery') {
            orderSuccessText.textContent = `Курьер привезет горячий заказ по адресу: ${orderStreet.value.trim()}. Детали переданы в пекарню!`;
          } else {
            const spotEl = document.getElementById('order-spot');
            const spotText = spotEl ? spotEl.options[spotEl.selectedIndex].text : 'выбранной точке';
            orderSuccessText.textContent = `Готовим горячими к вашему времени на точке: ${spotText}. Ждем вас!`;
          }
        }

        checkoutForm.style.display = 'none';
        if (orderSuccessMsg) orderSuccessMsg.removeAttribute('hidden');

        setTimeout(() => {
          cart.items = {};
          updateAllUI();
          if (orderSuccessMsg) orderSuccessMsg.setAttribute('hidden', '');
          checkoutForm.reset();
          if (orderConsent) orderConsent.checked = true;
          setDeliveryMethod('pickup');
          checkoutForm.style.display = 'flex';
          closeCart();
        }, 4000);
      });
    }
  }

  // 4. Модальное окно политики обработки персональных данных
  function initPolicyModal() {
    const openBtn = document.getElementById('open-policy-btn');
    const closeBtn = document.getElementById('close-policy-btn');
    const confirmBtn = document.getElementById('confirm-policy-btn');
    const backdrop = document.getElementById('policy-backdrop');
    const modal = document.getElementById('policy-modal');

    if (!modal || !backdrop) return;

    function openModal() {
      modal.classList.add('is-open');
      backdrop.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      backdrop.setAttribute('aria-hidden', 'false');
      document.addEventListener('keydown', onKeyDown);
    }

    function closeModal() {
      modal.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      backdrop.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (confirmBtn) confirmBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
  }

  // 5. Уведомление об использовании файлов cookie
  function initCookieNotice() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies-btn');

    if (!banner || !acceptBtn) return;

    const COOKIE_KEY = 'smazhenka_cookie_accepted';
    let isAccepted = false;
    try {
      isAccepted = localStorage.getItem(COOKIE_KEY) === 'true';
    } catch (e) {
      // LocalStorage недоступен
    }

    if (!isAccepted) {
      setTimeout(() => {
        banner.classList.add('is-visible');
      }, 1000);
    }

    acceptBtn.addEventListener('click', () => {
      try {
        localStorage.setItem(COOKIE_KEY, 'true');
      } catch (e) {
        // LocalStorage недоступен
      }
      banner.classList.remove('is-visible');
    });
  }

  // 6. Плавный скролл к якорям с учетом липкого заголовка
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
      initPolicyModal();
      initCookieNotice();
      initSmoothScroll();
    });
  } else {
    initOvenStatus();
    initMenuFilters();
    initCartAndOrder();
    initPolicyModal();
    initCookieNotice();
    initSmoothScroll();
  }
})();
