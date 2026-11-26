import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { CartDrawer } from './components/CartDrawer';
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

  return (
    <MotionConfig reducedMotion="user">
      <Header totalCount={totalCount} onOpenCart={() => setIsCartOpen(true)} />

      <main id="main-content">
        <Hero />
        <MenuSection
          quantities={quantities}
          onAddItem={(id) => addItem(id, 1)}
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
        onAddToCart={addItem}
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
