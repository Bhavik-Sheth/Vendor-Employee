import React, { useState, useCallback, useMemo } from 'react';
import { Screen } from '../types';
import type { Store, VendorType, CartItem, Order } from '../types';
import { STORES, VENDOR_TYPES } from '../constants';
import { useSharedState } from '../context/SharedStateContext';

import SplashScreen from './components/SplashScreen';
import SelectStoreScreen from './components/SelectStoreScreen';
import SelectVendorTypeScreen from './components/SelectVendorTypeScreen';
import BrowseProductsScreen from './components/BrowseProductsScreen';
import PickupTimeScreen from './components/PickupTimeScreen';
import OrderConfirmationScreen from './components/OrderConfirmationScreen';
import PastOrdersScreen from './components/PastOrdersScreen';
import HelpModal from './components/HelpModal';

interface VendorAppProps {
  onBackToHome: () => void;
}

const VendorApp: React.FC<VendorAppProps> = ({ onBackToHome }) => {
  const { products, addVendorOrder, vendorOrders } = useSharedState();
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Splash);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedVendorType, setSelectedVendorType] = useState<VendorType | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);

  const resetToHome = useCallback(() => {
    setCurrentScreen(Screen.Splash);
    setSelectedStore(null);
    setSelectedVendorType(null);
    setCart([]);
    setConfirmedOrder(null);
  }, []);

  const handleStartShopping = () => {
    setConfirmedOrder(null);
    setCurrentScreen(Screen.SelectStore);
  };
  
  const handleViewPastOrders = () => {
    setConfirmedOrder(null);
    setCurrentScreen(Screen.PastOrders);
  };

  const handleGoHomeFromConfirmation = () => {
    setCurrentScreen(Screen.Splash);
    setCart([]);
  };

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    setCurrentScreen(Screen.SelectVendorType);
  };

  const handleSelectVendorType = (vendorType: VendorType) => {
    setSelectedVendorType(vendorType);
    setCurrentScreen(Screen.BrowseProducts);
  };

  const handleUpdateCart = (productId: string, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      if (quantity <= 0) {
        return prevCart.filter(item => item.productId !== productId);
      }
      if (existingItem) {
        return prevCart.map(item => item.productId === productId ? { ...item, quantity } : item);
      }
      return [...prevCart, { productId, quantity }];
    });
  };
  
  const handleConfirmPickupTime = (timeSlot: string) => {
    if (!selectedStore || cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const newOrder: Order = {
      id: `A${Math.floor(100 + Math.random() * 900)}`,
      items: cart,
      total,
      pickupTime: timeSlot,
      store: selectedStore,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'}),
      status: 'pending',
    };

    setConfirmedOrder(newOrder);
    addVendorOrder(newOrder);
    setCurrentScreen(Screen.OrderConfirmation);
  };
  
  const handleReorder = (order: Order) => {
    const storeForReorder = STORES.find(s => s.id === order.store.id)
    if(storeForReorder && storeForReorder.isOpen) {
      setConfirmedOrder(null);
      setSelectedStore(storeForReorder);
      setCart(order.items);
      setCurrentScreen(Screen.BrowseProducts);
    } else {
      alert("The store for this order is currently closed or unavailable. Please start a new order.");
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Splash:
        return <SplashScreen onStart={handleStartShopping} onViewOrders={handleViewPastOrders} onBackToHome={onBackToHome} recentOrder={confirmedOrder} />;
      case Screen.SelectStore:
        return <SelectStoreScreen stores={STORES} onSelectStore={handleSelectStore} onBack={resetToHome} />;
      case Screen.SelectVendorType:
        return <SelectVendorTypeScreen vendorTypes={VENDOR_TYPES} onSelectVendorType={handleSelectVendorType} onBack={() => setCurrentScreen(Screen.SelectStore)} />;
      case Screen.BrowseProducts:
        return <BrowseProductsScreen
          products={products}
          cart={cart}
          onUpdateCart={handleUpdateCart}
          onViewOrder={() => setCurrentScreen(Screen.PickupTime)}
          onOpenHelp={() => setHelpModalOpen(true)}
          onBack={() => setCurrentScreen(Screen.SelectVendorType)}
        />;
      case Screen.PickupTime:
        return <PickupTimeScreen onConfirm={handleConfirmPickupTime} onBack={() => setCurrentScreen(Screen.BrowseProducts)} />;
      case Screen.OrderConfirmation:
        return confirmedOrder ? <OrderConfirmationScreen order={confirmedOrder} products={products} onGoHome={handleGoHomeFromConfirmation} /> : <SplashScreen onStart={handleStartShopping} onViewOrders={handleViewPastOrders} onBackToHome={onBackToHome} recentOrder={null} />;
      case Screen.PastOrders:
        return <PastOrdersScreen orders={vendorOrders} products={products} onReorder={handleReorder} onBack={resetToHome} />;
      default:
        return <SplashScreen onStart={handleStartShopping} onViewOrders={handleViewPastOrders} onBackToHome={onBackToHome} recentOrder={null} />;
    }
  };

  return (
    <div className="antialiased text-gray-800">
      {renderScreen()}
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </div>
  );
};

export default VendorApp;