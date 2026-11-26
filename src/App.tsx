import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { BakeryMarquee } from './components/BakeryMarquee';
import { CartDrawer } from './components/CartDrawer';
import { CartToast } from './components/CartToast';
import { CookieBanner } from './components/CookieBanner';
import { CraftSection } from './components/CraftSection';
import { DishModal } from './components/DishModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HotlineBanner } from './components/HotlineBanner';
import { LocationsSection } from './components/LocationsSection';
import { MenuSection } from './components/MenuSection';
import { OrderTray } from './components/OrderTray';
import { PolicyModal } from './components/PolicyModal';
import { DISHES } from './data/menuData';
import { useCart } from './hooks/useCart';
import type { DishItem } from './types/menu';

export function App() {
  const {
    quantities,
    cartEntries,
    totalCount,
    subtotal,
    deliveryFee,
    orderTotal,
    remainingForMin,
    minProgress,
    deliveryMethod,
    setDeliveryMethod,
    selectedSpot,
    setSelectedSpot,
    addItem,
    updateItemQty,
    clearCart,
  } = useCart();

  const [selectedDish, setSelectedDish] = useState<DishItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showAddToast = useCallback((dishId: string, qtyAdded: number) => {
    const dish = DISHES.find((d) => d.id === dishId);
    if (!dish) return;
    setToastMessage(`В корзине: ${dish.name} (+${qtyAdded})`);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleAddWithToast = useCallback(
    (dishId: string, qty = 1) => {
      addItem(dishId, qty);
      showAddToast(dishId, qty);
    },
    [addItem, showAddToast]
  );

  return (
    <MotionConfig reducedMotion="user">
      <Header totalCount={totalCount} onOpenCart={() => setIsCartOpen(true)} />
      <CartToast message={toastMessage} />

      <main id="main-content">
        <Hero />
        <BakeryMarquee />
        <MenuSection
          quantities={quantities}
          onAddItem={(id) => handleAddWithToast(id, 1)}
          onUpdateQty={updateItemQty}
          onSelectDish={setSelectedDish}
        />
        <CraftSection />
        <HotlineBanner />
        <LocationsSection />
      </main>

      <Footer hasOrderTray={totalCount > 0} />

      <OrderTray
        totalCount={totalCount}
        orderTotal={orderTotal}
        onReset={clearCart}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <DishModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={handleAddWithToast}
        isCartOpen={isCartOpen}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartEntries={cartEntries}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        orderTotal={orderTotal}
        remainingForMin={remainingForMin}
        minProgress={minProgress}
        deliveryMethod={deliveryMethod}
        onDeliveryMethodChange={setDeliveryMethod}
        selectedSpot={selectedSpot}
        onSelectedSpotChange={setSelectedSpot}
        onUpdateQty={updateItemQty}
        onClearCart={clearCart}
        isPolicyOpen={isPolicyOpen}
        onOpenPolicy={() => setIsPolicyOpen(true)}
      />

      <PolicyModal isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
      <CookieBanner hasOrderTray={totalCount > 0} />
    </MotionConfig>
  );
}

export default App;
