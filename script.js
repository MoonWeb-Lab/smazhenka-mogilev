/**
 * Смаженка Могилёв: статус работы, фильтры меню, корзина и оформление заказа
 */

document.documentElement.classList.add('js');

(function() {
  'use strict';

  const MIN_ORDER_AMOUNT = 20.00;
  const DELIVERY_FEE = 4.00;
  const FREE_DELIVERY_THRESHOLD = 40.00;
  const STATE_STORAGE_KEY = 'smazhenka_state_v1';

  const DISHES_DATA = {
    'smazhenka-pepper-meat': {
      weight: '140 г',
      factor: 1.4,
      image: 'img/dish-pepper.jpg',
      alt: 'Мясная смаженка с болгарским перцем и сыром',
      description: 'Горячая смаженка на воздушном опарном тесте с сочным свиным фаршем, сливочным белым соусом, сладким болгарским перцем и расплавленным сыром.',
      ingredients: 'Тесто дрожжевое опарное (мука пшеничная в/с, вода, дрожжи, сахар, соль, масло подсолнечное), свиной фарш, сладкий болгарский перец, сыр полутвёрдый, белый соус на сметанной основе, чёрный перец.',
      per100: { kcal: 268, protein: 11.4, fat: 13.8, carbs: 24.5 }
    },
    'smazhenka-salami': {
      weight: '130 г',
      factor: 1.3,
      image: 'img/dish-salami.jpg',
      alt: 'Смаженка с салями и расплавленным сыром',
      description: 'Классическая могилёвская смаженка с подкопчённой салями, сметанно-яичной заливкой и румяной сырной корочкой прямо с противня.',
      ingredients: 'Тесто дрожжевое опарное, колбаса салями, сыр полутвёрдый, яйцо куриное, сметана, лук репчатый, специи.',
      per100: { kcal: 292, protein: 11.8, fat: 16.2, carbs: 24.8 }
    },
    'smazhenka-ham-cheese': {
      weight: '140 г',
      factor: 1.4,
      image: 'img/dish-ham.jpg',
      alt: 'Смаженка ветчина под сыром',
      description: 'Нежная основа из пышного теста с рубленой фермерской ветчиной и плотным слоем запечённого сыра.',
      ingredients: 'Тесто дрожжевое опарное, ветчина свиная, сыр твёрдый и полутвёрдый, сметанная заливка, яйцо куриное, укроп.',
      per100: { kcal: 256, protein: 12.1, fat: 12.4, carbs: 23.9 }
    },
    'smazhenka-mushrooms': {
      weight: '135 г',
      factor: 1.35,
      image: 'img/dish-mushroom.jpg',
      alt: 'Грибная смаженка с жареным луком',
      description: 'Ароматные шампиньоны, обжаренные до золотистости с репчатым луком, под сливочной заливкой и слоем тягучего сыра.',
      ingredients: 'Тесто дрожжевое опарное, шампиньоны свежие, лук репчатый, сыр полутвёрдый, сметана, яйцо куриное, масло подсолнечное, соль, перец.',
      per100: { kcal: 234, protein: 9.2, fat: 10.6, carbs: 25.4 }
    },
    'smazhenka-tuna': {
      weight: '135 г',
      factor: 1.35,
      image: 'img/dish-tuna.jpg',
      alt: 'Смаженка с филе тунца и сыром',
      description: 'Сытная смаженка с филе тунца, сладковатым репчатым луком и нежной яично-сливочной шапочкой.',
      ingredients: 'Тесто дрожжевое опарное, тунец консервированный в собственном соку, лук репчатый, сыр полутвёрдый, яйцо куриное, сметана, специи.',
      per100: { kcal: 238, protein: 13.5, fat: 9.4, carbs: 24.9 }
    },
    'smazhenka-shrimp': {
      weight: '140 г',
      factor: 1.4,
      image: 'img/dish-shrimp.jpg',
      alt: 'Смаженка с королевскими креветками и моцареллой',
      description: 'Королевские креветки в мягком сливочно-чесночном соусе под золотистой корочкой из моцареллы.',
      ingredients: 'Тесто дрожжевое опарное, креветки очищенные, сыр моцарелла, сливки, чеснок свежий, масло сливочное, зелень петрушки.',
      per100: { kcal: 248, protein: 13.2, fat: 10.8, carbs: 24.4 }
    },
    'smazhenka-four-cheese': {
      weight: '135 г',
      factor: 1.35,
      image: 'img/dish-four-cheese.jpg',
      alt: 'Смаженка Четыре сыра с зеленью',
      description: 'Насыщенная сырная начинка из четырёх видов сыра на пышном тесте со свежей зеленью.',
      ingredients: 'Тесто дрожжевое опарное, сыр моцарелла, сыр голландский, сулугуни, сыр творожный, сливки, укроп и петрушка.',
      per100: { kcal: 288, protein: 13.6, fat: 15.8, carbs: 22.9 }
    },
    'smazhenka-chicken-pineapple': {
      weight: '140 г',
      factor: 1.4,
      image: 'img/dish-chicken.jpg',
      alt: 'Смаженка с курицей и ананасом под сыром',
      description: 'Филе куриной грудки, сочные кусочки ананаса и мягкий сливочный соус под запечённым сыром.',
      ingredients: 'Тесто дрожжевое опарное, куриное филе запечённое, ананас консервированный, сыр полутвёрдый, белый сливочный соус, специи.',
      per100: { kcal: 244, protein: 12.8, fat: 9.8, carbs: 26.1 }
    },
    'smazhenka-student': {
      weight: '145 г',
      factor: 1.45,
      image: 'img/dish-student.jpg',
      alt: 'Смаженка студенческая с курицей и картофелем',
      description: 'Самая сытная смаженка в меню: рубленое филе цыплёнка, нежный картофельный слой и хрустящая сырная корочка.',
      ingredients: 'Тесто дрожжевое опарное, филе цыплёнка, картофель отварной, сыр полутвёрдый, лук, сметанная заливка, чёрный перец.',
      per100: { kcal: 242, protein: 11.2, fat: 9.6, carbs: 27.6 }
    },
    'drink-broth': {
      weight: '250 мл',
      factor: 2.5,
      image: 'img/dish-broth.jpg',
      alt: 'Горячий куриный бульон с зеленью',
      description: 'Наваристый горячий куриный бульон со свежим укропом и щепоткой чёрного перца в стакане с крышкой.',
      ingredients: 'Бульон куриный на кости и филе, морковь, лук репчатый, укроп свежий, лавровый лист, соль, перец чёрный.',
      per100: { kcal: 36, protein: 3.4, fat: 1.8, carbs: 1.5 }
    },
    'drink-morse': {
      weight: '300 мл',
      factor: 3.0,
      image: 'img/dish-morse.jpg',
      alt: 'Домашний клюквенный морс в стакане',
      description: 'Освежающий кисло-сладкий морс из цельной полесской клюквы, сваренный в пекарне без красителей.',
      ingredients: 'Вода питьевая очищенная, клюква свежемороженая, сахар белый.',
      per100: { kcal: 42, protein: 0.1, fat: 0.1, carbs: 10.2 }
    },
    'drink-coffee': {
      weight: '200 мл',
      factor: 2.0,
      image: 'img/dish-coffee.jpg',
      alt: 'Свежесваренный кофе с молочной пенкой',
      description: 'Бодрящий американо или мягкий капучино из свежемолотых зёрен арабики.',
      ingredients: 'Зерновой кофе 100% арабика, вода очищенная, молоко пастеризованное 3.2% (для капучино).',
      per100: { kcal: 32, protein: 1.6, fat: 1.7, carbs: 2.6 }
    },
    'drink-tea': {
      weight: '300 мл',
      factor: 3.0,
      image: 'img/dish-tea.jpg',
      alt: 'Горячий чай с долькой лимона',
      description: 'Классический горячий чёрный, зелёный или травяной чай с долькой свежего лимона.',
      ingredients: 'Вода питьевая, заварка листовая на выбор (чёрный, зелёный, травяной сбор), лимон свежий.',
      per100: { kcal: 4, protein: 0.1, fat: 0.0, carbs: 0.9 }
    }
  };

  const cart = {
    items: {},
    totalCount: 0,
    subtotal: 0,
    totalPrice: 0
  };

  let deliveryMethod = 'pickup';
  let selectedSpot = 'chel';

  function loadSavedState() {
    try {
      const raw = localStorage.getItem(STATE_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (parsed.items && typeof parsed.items === 'object') {
          for (const [id, item] of Object.entries(parsed.items)) {
            if (item && Number.isInteger(item.qty) && item.qty > 0 && typeof item.price === 'number' && typeof item.name === 'string') {
              cart.items[id] = { qty: item.qty, price: item.price, name: item.name };
            }
          }
        }
        if (parsed.deliveryMethod === 'delivery' || parsed.deliveryMethod === 'pickup') {
          deliveryMethod = parsed.deliveryMethod;
        }
        if (parsed.selectedSpot === 'chel' || parsed.selectedSpot === 'stroit') {
          selectedSpot = parsed.selectedSpot;
        }
      }
    } catch (e) {
      // localStorage недоступен
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify({
        items: cart.items,
        deliveryMethod,
        selectedSpot
      }));
    } catch (e) {
      // localStorage недоступен
    }
  }

  // 1. Статус работы пекарен (без таймера обратного отсчёта)
  function initOpenStatus() {
    const statusTextEl = document.getElementById('status-text');
    const statusDotEl = document.getElementById('status-dot');

    function updateStatus() {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const mogilevTime = new Date(utc + (3600000 * 3));

      const day = mogilevTime.getDay();
      const isWeekend = day === 0 || day === 6;
      const hours = mogilevTime.getHours();

      const openHour = isWeekend ? 10 : 9;
      const closeHour = isWeekend ? 20 : 21;
      const isOpen = hours >= openHour && hours < closeHour;

      if (statusTextEl) {
        statusTextEl.textContent = isOpen
          ? `Печи работают: открыто до ${closeHour}:00`
          : `Откроется в ${openHour}:00`;
      }
      if (statusDotEl) {
        statusDotEl.classList.toggle('is-closed', !isOpen);
      }
    }

    updateStatus();
    setInterval(updateStatus, 60000);
  }

  // 2. Плавное GPU-появление блоков при скролле
  function initScrollReveal() {
    const blocks = document.querySelectorAll('.reveal-block');
    if (!blocks.length) return;

    if (!('IntersectionObserver' in window)) {
      blocks.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    blocks.forEach((el) => observer.observe(el));
  }

  // 3. Фильтрация категорий меню
  function initMenuFilters() {
    const filterWrap = document.getElementById('menu-filter-sticky-wrap');
    const tabs = Array.from(document.querySelectorAll('.menu-tab'));
    const menuCards = document.querySelectorAll('.menu-card');

    if (filterWrap) {
      const sentinel = document.createElement('div');
      sentinel.setAttribute('aria-hidden', 'true');
      filterWrap.parentNode.insertBefore(sentinel, filterWrap);

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            filterWrap.classList.toggle('is-stuck', !entry.isIntersecting);
          },
          { rootMargin: '-65px 0px 0px 0px', threshold: 0 }
        );
        observer.observe(sentinel);
      }
    }

    if (!tabs.length || !menuCards.length) return;

    function activateTab(tab) {
      const selectedCategory = tab.getAttribute('data-category');

      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('aria-pressed', 'false');
      });

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('aria-pressed', 'true');

      menuCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        const isMatch = selectedCategory === 'all' || cardCategory === selectedCategory;
        if (isMatch) {
          card.removeAttribute('hidden');
          card.classList.add('is-revealed');
        } else {
          card.setAttribute('hidden', '');
        }
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const dir = e.key === 'ArrowRight' ? 1 : -1;
          const nextTab = tabs[(index + dir + tabs.length) % tabs.length];
          nextTab.focus();
          activateTab(nextTab);
        }
      });
    });
  }

  function createStepperElement(itemName, qty) {
    const stepper = document.createElement('div');
    stepper.className = 'stepper';
    stepper.setAttribute('role', 'group');
    stepper.setAttribute('aria-label', `Количество для ${itemName}`);

    const decBtn = document.createElement('button');
    decBtn.type = 'button';
    decBtn.className = 'stepper-btn';
    decBtn.setAttribute('data-action', 'decrease');
    decBtn.setAttribute('aria-label', `Уменьшить ${itemName}`);
    decBtn.textContent = '-';

    const countSpan = document.createElement('span');
    countSpan.className = 'stepper-count';
    countSpan.setAttribute('aria-live', 'polite');
    countSpan.textContent = String(qty);

    const incBtn = document.createElement('button');
    incBtn.type = 'button';
    incBtn.className = 'stepper-btn';
    incBtn.setAttribute('data-action', 'increase');
    incBtn.setAttribute('aria-label', `Увеличить ${itemName}`);
    incBtn.textContent = '+';

    stepper.append(decBtn, countSpan, incBtn);
    return stepper;
  }

  // 4. Корзина, расчёт заказа и отправка заявки
  function initCartAndOrder() {
    const menuGrid = document.querySelector('.menu-grid');
    const orderTray = document.querySelector('.order-tray');
    const dishBackdrop = document.getElementById('dish-backdrop');
    const dishModal = document.getElementById('dish-modal');
    const closeDishBtn = document.getElementById('close-dish-btn');
    const dishModalImg = document.getElementById('dish-modal-img');
    const dishModalTitle = document.getElementById('dish-modal-title');
    const dishModalWeight = document.getElementById('dish-modal-weight');
    const dishModalPrice = document.getElementById('dish-modal-price');
    const dishModalDesc = document.getElementById('dish-modal-desc');
    const dishModalIngredients = document.getElementById('dish-modal-ingredients');
    const dishPortionCol = document.getElementById('dish-portion-col');
    const dishNutritionBody = document.getElementById('dish-nutrition-body');
    const dishQtyDec = document.getElementById('dish-qty-dec');
    const dishQtyInc = document.getElementById('dish-qty-inc');
    const dishQtyVal = document.getElementById('dish-qty-val');
    const dishAddBtn = document.getElementById('dish-add-btn');
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
    const orderNewBtn = document.getElementById('order-new-btn');

    const methodPickupBtn = document.getElementById('method-pickup-btn');
    const methodDeliveryBtn = document.getElementById('method-delivery-btn');
    const pickupFields = document.getElementById('pickup-fields');
    const deliveryFields = document.getElementById('delivery-fields');
    const orderSpot = document.getElementById('order-spot');
    const orderConsent = document.getElementById('order-consent');
    const orderStreet = document.getElementById('order-street');
    const orderName = document.getElementById('order-name');
    const orderPhone = document.getElementById('order-phone');

    const streetError = document.getElementById('street-error');
    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');

    let lastFocusedBeforeCart = null;
    let lastFocusedBeforeDish = null;
    let activeDish = null;
    let activeDishQty = 1;

    function renderNutritionRows(per100, factor) {
      if (!dishNutritionBody) return;
      dishNutritionBody.replaceChildren();
      const rows = [
        ['Калории', `${Math.round(per100.kcal)} ккал`, `${Math.round(per100.kcal * factor)} ккал`],
        ['Белки', `${per100.protein.toFixed(1)} г`, `${(per100.protein * factor).toFixed(1)} г`],
        ['Жиры', `${per100.fat.toFixed(1)} г`, `${(per100.fat * factor).toFixed(1)} г`],
        ['Углеводы', `${per100.carbs.toFixed(1)} г`, `${(per100.carbs * factor).toFixed(1)} г`]
      ];
      for (const [label, val100, valPortion] of rows) {
        const tr = document.createElement('tr');
        const tdLabel = document.createElement('td');
        tdLabel.textContent = label;
        const td100 = document.createElement('td');
        td100.className = 'num';
        td100.textContent = val100;
        const tdPortion = document.createElement('td');
        tdPortion.className = 'num';
        tdPortion.textContent = valPortion;
        tr.append(tdLabel, td100, tdPortion);
        dishNutritionBody.appendChild(tr);
      }
    }

    function updateDishModalAddBtn() {
      if (!activeDish || !dishQtyVal || !dishAddBtn) return;
      dishQtyVal.textContent = String(activeDishQty);
      const total = (activeDish.price * activeDishQty).toFixed(2);
      dishAddBtn.textContent = `Добавить в корзину: ${total} BYN`;
    }

    function openDishModal(card) {
      if (!dishModal || !dishBackdrop || !card) return;
      const id = card.getAttribute('data-id');
      const price = parseFloat(card.getAttribute('data-price') || '0');
      const name = card.querySelector('.menu-card-trigger')?.textContent?.trim()
        || card.querySelector('.menu-card-name')?.textContent?.trim()
        || '';
      const data = DISHES_DATA[id];
      if (!data) return;

      activeDish = { id, price, name };
      activeDishQty = 1;
      lastFocusedBeforeDish = document.activeElement;

      if (dishModalImg) {
        dishModalImg.src = data.image;
        dishModalImg.alt = data.alt;
      }
      if (dishModalTitle) dishModalTitle.textContent = name;
      if (dishModalWeight) dishModalWeight.textContent = data.weight;
      if (dishModalPrice) dishModalPrice.textContent = `${price.toFixed(2)} BYN`;
      if (dishModalDesc) dishModalDesc.textContent = data.description;
      if (dishModalIngredients) dishModalIngredients.textContent = data.ingredients;
      if (dishPortionCol) dishPortionCol.textContent = `На порцию (${data.weight})`;

      renderNutritionRows(data.per100, data.factor);
      updateDishModalAddBtn();

      dishModal.classList.add('is-open');
      dishBackdrop.classList.add('is-open');
      dishModal.setAttribute('aria-hidden', 'false');
      dishBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onDishKeyDown);
      if (closeDishBtn) closeDishBtn.focus();
    }

    function closeDishModal() {
      if (!dishModal || !dishBackdrop) return;
      dishModal.classList.remove('is-open');
      dishBackdrop.classList.remove('is-open');
      dishModal.setAttribute('aria-hidden', 'true');
      dishBackdrop.setAttribute('aria-hidden', 'true');
      if (!cartDrawer || !cartDrawer.classList.contains('is-open')) {
        document.body.style.overflow = '';
      }
      document.removeEventListener('keydown', onDishKeyDown);
      if (lastFocusedBeforeDish && typeof lastFocusedBeforeDish.focus === 'function') {
        lastFocusedBeforeDish.focus();
      }
    }

    function onDishKeyDown(e) {
      if (e.key === 'Escape' && dishModal && dishModal.classList.contains('is-open')) {
        closeDishModal();
      }
    }

    if (closeDishBtn) closeDishBtn.addEventListener('click', closeDishModal);
    if (dishBackdrop) dishBackdrop.addEventListener('click', closeDishModal);
    if (dishQtyDec) {
      dishQtyDec.addEventListener('click', () => {
        if (activeDishQty > 1) {
          activeDishQty -= 1;
          updateDishModalAddBtn();
        }
      });
    }
    if (dishQtyInc) {
      dishQtyInc.addEventListener('click', () => {
        activeDishQty += 1;
        updateDishModalAddBtn();
      });
    }
    if (dishAddBtn) {
      dishAddBtn.addEventListener('click', () => {
        if (!activeDish) return;
        const { id, price, name } = activeDish;
        if (cart.items[id]) {
          cart.items[id].qty += activeDishQty;
        } else {
          cart.items[id] = { qty: activeDishQty, price, name };
        }
        resetSuccessView();
        updateAllUI();
        closeDishModal();
      });
    }

    if (orderSpot) {
      orderSpot.value = selectedSpot;
      orderSpot.addEventListener('change', () => {
        selectedSpot = orderSpot.value;
        saveState();
      });
    }

    function setFieldError(inputEl, errorEl, message) {
      if (inputEl) inputEl.classList.add('is-invalid');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.removeAttribute('hidden');
      }
    }

    function clearFieldError(inputEl, errorEl) {
      if (inputEl) inputEl.classList.remove('is-invalid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.setAttribute('hidden', '');
      }
    }

    if (orderName) {
      orderName.addEventListener('input', () => clearFieldError(orderName, nameError));
    }
    if (orderPhone) {
      orderPhone.addEventListener('input', () => clearFieldError(orderPhone, phoneError));
    }
    if (orderStreet) {
      orderStreet.addEventListener('input', () => clearFieldError(orderStreet, streetError));
    }

    function resetSuccessView() {
      if (orderSuccessMsg) orderSuccessMsg.setAttribute('hidden', '');
      if (checkoutForm) checkoutForm.style.display = 'flex';
    }

    function openCart() {
      if (!cartDrawer || !cartBackdrop) return;
      lastFocusedBeforeCart = document.activeElement;
      cartDrawer.classList.add('is-open');
      cartBackdrop.classList.add('is-open');
      cartDrawer.setAttribute('aria-hidden', 'false');
      cartBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKeyDown);
      if (closeCartBtn) closeCartBtn.focus();
    }

    function closeCart() {
      if (!cartDrawer || !cartBackdrop) return;
      cartDrawer.classList.remove('is-open');
      cartBackdrop.classList.remove('is-open');
      cartDrawer.setAttribute('aria-hidden', 'true');
      cartBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      if (orderSuccessMsg && !orderSuccessMsg.hasAttribute('hidden')) {
        resetSuccessView();
      }
      if (lastFocusedBeforeCart && typeof lastFocusedBeforeCart.focus === 'function') {
        lastFocusedBeforeCart.focus();
      }
    }

    function onKeyDown(e) {
      const policyModal = document.getElementById('policy-modal');
      if (policyModal && policyModal.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        closeCart();
      }
    }

    if (openCartBtn) openCartBtn.addEventListener('click', openCart);
    if (trayOpenCartBtn) trayOpenCartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
    if (orderNewBtn) {
      orderNewBtn.addEventListener('click', () => {
        resetSuccessView();
      });
    }

    function getRussianPlural(n, forms) {
      const absN = Math.abs(n) % 100;
      const n1 = absN % 10;
      if (absN > 10 && absN < 20) return forms[2];
      if (n1 > 1 && n1 < 5) return forms[1];
      if (n1 === 1) return forms[0];
      return forms[2];
    }

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
        clearFieldError(orderStreet, streetError);
      }
      saveState();
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

      let currentDeliveryFee = 0;
      if (deliveryMethod === 'delivery') {
        if (foodSubtotal >= FREE_DELIVERY_THRESHOLD) {
          currentDeliveryFee = 0;
          if (cartDeliveryLabel) cartDeliveryLabel.textContent = 'Доставка курьером:';
          if (cartDeliveryVal) {
            cartDeliveryVal.textContent = 'Бесплатно (от 40 BYN)';
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

      document.body.classList.toggle('has-order-tray', count > 0);

      if (headerCartBadge) {
        headerCartBadge.textContent = String(count);
      }

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

      if (cartSubtotalVal) cartSubtotalVal.textContent = `${foodSubtotal.toFixed(2)} BYN`;
      if (cartTotalVal) cartTotalVal.textContent = `${orderTotal.toFixed(2)} BYN`;

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
          checkoutBtnText.textContent = `Добавьте ещё на ${diff.toFixed(2)} BYN (минимум 20)`;
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
          cartProgressStatus.textContent = 'Минимальный заказ набран, можно оформлять.';
          cartProgressStatus.classList.add('is-complete');
        }
        if (cartProgressBar) cartProgressBar.classList.add('is-complete');
        if (checkoutSubmitBtn) {
          checkoutSubmitBtn.disabled = false;
          checkoutSubmitBtn.removeAttribute('aria-disabled');
        }
        if (checkoutBtnText) {
          checkoutBtnText.textContent = `Отправить заказ на ${orderTotal.toFixed(2)} BYN`;
        }
      }

      renderCartDrawerItems();
      syncMenuCardsUI();
      saveState();
    }

    function renderCartDrawerItems() {
      if (!cartItemsList) return;

      cartItemsList.replaceChildren();
      const itemIds = Object.keys(cart.items);

      if (itemIds.length === 0) {
        const emptyBox = document.createElement('div');
        emptyBox.className = 'cart-empty-state';
        emptyBox.id = 'cart-empty-state';

        const emptyTitle = document.createElement('p');
        emptyTitle.className = 'cart-empty-text';
        emptyTitle.textContent = 'В корзине пока пусто';

        const emptySub = document.createElement('p');
        emptySub.className = 'cart-empty-sub';
        emptySub.textContent = 'Выберите смаженки или напитки в меню';

        emptyBox.append(emptyTitle, emptySub);
        cartItemsList.appendChild(emptyBox);
        return;
      }

      const fragment = document.createDocumentFragment();
      for (const id of itemIds) {
        const item = cart.items[id];
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.setAttribute('data-id', id);

        const info = document.createElement('div');
        info.className = 'cart-item-info';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'cart-item-name';
        nameSpan.textContent = item.name;

        const priceSpan = document.createElement('span');
        priceSpan.className = 'cart-item-price num';
        priceSpan.textContent = `${item.price.toFixed(2)} BYN за шт`;

        info.append(nameSpan, priceSpan);

        const stepper = createStepperElement(item.name, item.qty);

        const subtotalSpan = document.createElement('span');
        subtotalSpan.className = 'cart-item-subtotal';
        subtotalSpan.textContent = `${(item.qty * item.price).toFixed(2)} BYN`;

        row.append(info, stepper, subtotalSpan);
        fragment.appendChild(row);
      }

      cartItemsList.appendChild(fragment);
    }

    function syncMenuCardsUI() {
      document.querySelectorAll('.menu-card').forEach((card) => {
        const id = card.getAttribute('data-id');
        const addBtn = card.querySelector('.item-btn');
        let stepper = card.querySelector('.stepper');

        if (cart.items[id] && cart.items[id].qty > 0) {
          if (addBtn) addBtn.style.display = 'none';
          if (!stepper) {
            const footBox = card.querySelector('.menu-card-foot');
            if (footBox) {
              stepper = createStepperElement(cart.items[id].name, cart.items[id].qty);
              footBox.appendChild(stepper);
            }
          } else {
            stepper.style.display = 'inline-flex';
            const countEl = stepper.querySelector('.stepper-count');
            if (countEl) countEl.textContent = String(cart.items[id].qty);
          }
        } else {
          if (addBtn) addBtn.style.display = 'inline-flex';
          if (stepper) stepper.style.display = 'none';
        }
      });
    }

    function updateItemQty(id, delta) {
      if (!cart.items[id]) return;
      cart.items[id].qty += delta;
      if (cart.items[id].qty <= 0) {
        delete cart.items[id];
      }
      resetSuccessView();
      updateAllUI();
    }

    if (menuGrid) {
      menuGrid.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.item-btn');
        const stepBtn = e.target.closest('.stepper-btn');

        if (addBtn) {
          const card = addBtn.closest('.menu-card');
          if (!card) return;
          const id = card.getAttribute('data-id');
          const price = parseFloat(card.getAttribute('data-price') || '0');
          const name = card.querySelector('.menu-card-trigger')?.textContent?.trim()
            || card.querySelector('.menu-card-name')?.textContent?.trim()
            || '';
          cart.items[id] = { qty: 1, price, name };
          resetSuccessView();
          updateAllUI();
          return;
        }

        if (stepBtn) {
          const card = stepBtn.closest('.menu-card');
          if (!card) return;
          const id = card.getAttribute('data-id');
          const action = stepBtn.getAttribute('data-action');
          updateItemQty(id, action === 'increase' ? 1 : -1);
          return;
        }

        if (e.target.closest('.stepper')) return;

        const card = e.target.closest('.menu-card');
        if (card) {
          openDishModal(card);
        }
      });
    }

    if (cartItemsList) {
      cartItemsList.addEventListener('click', (e) => {
        const stepBtn = e.target.closest('.stepper-btn');
        if (!stepBtn) return;
        const row = stepBtn.closest('.cart-item-row');
        if (!row) return;
        const id = row.getAttribute('data-id');
        const action = stepBtn.getAttribute('data-action');
        updateItemQty(id, action === 'increase' ? 1 : -1);
      });
    }

    if (trayResetBtn) {
      trayResetBtn.addEventListener('click', () => {
        cart.items = {};
        resetSuccessView();
        updateAllUI();
      });
    }

    function isValidBelarusPhone(raw) {
      const digits = raw.replace(/\D/g, '');
      if (digits.startsWith('375')) return digits.length === 12;
      if (digits.startsWith('80')) return digits.length === 11;
      return digits.length >= 9 && digits.length <= 12;
    }

    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (cart.subtotal < MIN_ORDER_AMOUNT) return;

        if (orderConsent && !orderConsent.checked) {
          orderConsent.focus();
          return;
        }

        let firstInvalid = null;

        if (deliveryMethod === 'delivery') {
          if (!orderStreet || !orderStreet.value.trim()) {
            setFieldError(orderStreet, streetError, 'Укажите улицу и номер дома для доставки');
            firstInvalid = firstInvalid || orderStreet;
          } else {
            clearFieldError(orderStreet, streetError);
          }
        }

        if (!orderName || !orderName.value.trim()) {
          setFieldError(orderName, nameError, 'Укажите ваше имя');
          firstInvalid = firstInvalid || orderName;
        } else {
          clearFieldError(orderName, nameError);
        }

        const phoneVal = orderPhone ? orderPhone.value.trim() : '';
        if (!phoneVal) {
          setFieldError(orderPhone, phoneError, 'Укажите номер телефона для связи');
          firstInvalid = firstInvalid || orderPhone;
        } else if (!isValidBelarusPhone(phoneVal)) {
          setFieldError(orderPhone, phoneError, 'Введите номер в формате +375 (29) 700-70-79');
          firstInvalid = firstInvalid || orderPhone;
        } else {
          clearFieldError(orderPhone, phoneError);
        }

        if (firstInvalid) {
          firstInvalid.focus();
          return;
        }

        if (orderSuccessText) {
          if (deliveryMethod === 'delivery') {
            orderSuccessText.textContent = `Курьер привезёт заказ по адресу: ${orderStreet.value.trim()}. Если нужно уточнить детали, звоните +375 (29) 700-70-79.`;
          } else {
            const spotText = orderSpot ? orderSpot.options[orderSpot.selectedIndex].text : 'выбранной точке';
            orderSuccessText.textContent = `Готовим к вашему времени на точке: ${spotText}. Ждём вас в пекарне.`;
          }
        }

        cart.items = {};
        checkoutForm.reset();
        if (orderConsent) orderConsent.checked = true;
        if (orderSpot) orderSpot.value = selectedSpot;
        updateAllUI();

        checkoutForm.style.display = 'none';
        if (orderSuccessMsg) orderSuccessMsg.removeAttribute('hidden');
      });
    }

    setDeliveryMethod(deliveryMethod);
  }

  // 5. Модальное окно политики обработки персональных данных
  function initPolicyModal() {
    const openBtn = document.getElementById('open-policy-btn');
    const closeBtn = document.getElementById('close-policy-btn');
    const confirmBtn = document.getElementById('confirm-policy-btn');
    const backdrop = document.getElementById('policy-backdrop');
    const modal = document.getElementById('policy-modal');

    if (!modal || !backdrop) return;

    let lastFocusedBeforePolicy = null;

    function openModal() {
      lastFocusedBeforePolicy = document.activeElement;
      modal.classList.add('is-open');
      backdrop.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      backdrop.setAttribute('aria-hidden', 'false');
      document.addEventListener('keydown', onKeyDown);
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      backdrop.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', onKeyDown);
      if (lastFocusedBeforePolicy && typeof lastFocusedBeforePolicy.focus === 'function') {
        lastFocusedBeforePolicy.focus();
      }
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

  // 6. Уведомление об использовании файлов cookie
  function initCookieNotice() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies-btn');

    if (!banner || !acceptBtn) return;

    const COOKIE_KEY = 'smazhenka_cookie_accepted';
    let isAccepted = false;
    try {
      isAccepted = localStorage.getItem(COOKIE_KEY) === 'true';
    } catch (e) {
      // localStorage недоступен
    }

    if (!isAccepted) {
      setTimeout(() => {
        banner.classList.add('is-visible');
      }, 900);
    }

    acceptBtn.addEventListener('click', () => {
      try {
        localStorage.setItem(COOKIE_KEY, 'true');
      } catch (e) {
        // localStorage недоступен
      }
      banner.classList.remove('is-visible');
    });
  }

  // 7. Плавный скролл к якорям
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
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

  function bootstrap() {
    loadSavedState();
    initOpenStatus();
    initScrollReveal();
    initMenuFilters();
    initCartAndOrder();
    initPolicyModal();
    initCookieNotice();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
