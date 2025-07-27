import React, { useState, useCallback } from 'react';
import { Page } from '../types';
import { useSharedState } from '../context/SharedStateContext';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import BookOrderScreen from './components/BookOrderScreen';
import CompleteOrderScreen from './components/CompleteOrderScreen';
import AddStockScreen from './components/AddStockScreen';

interface EmployeeAppProps {
  onBackToHome: () => void;
}

const EmployeeApp: React.FC<EmployeeAppProps> = ({ onBackToHome }) => {
  const { stock, employeeOrders, updateStock, addEmployeeOrder, completeOrder } = useSharedState();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Login);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
    setCurrentPage(Page.Home);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentPage(Page.Login);
  }, []);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const handleBookOrder = useCallback((newOrder: Omit<import('../types').EmployeeOrder, 'id' | 'status'>) => {
    const orderId = `ORD${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const orderWithId: import('../types').EmployeeOrder = {
      ...newOrder,
      id: orderId,
      status: 'pending',
    };
    addEmployeeOrder(orderWithId);
    setLastOrderId(orderId);
    setCurrentPage(Page.BookingSuccess);
  }, [addEmployeeOrder]);

  const renderPage = () => {
    if (!isLoggedIn) {
      return <LoginScreen onLogin={handleLogin} onBackToHome={onBackToHome} />;
    }

    switch (currentPage) {
      case Page.Home:
        return <HomeScreen onNavigate={handleNavigate} onLogout={handleLogout} onBackToHome={onBackToHome} />;
      case Page.BookOrder:
        return <BookOrderScreen stock={stock} onBookOrder={handleBookOrder} onBack={() => handleNavigate(Page.Home)} />;
      case Page.BookingSuccess:
        return (
          <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="w-full max-w-lg mx-auto bg-gray-800 border border-green-700 p-8 rounded-xl shadow-lg text-center">
              <h2 className="text-2xl font-bold text-green-400 mb-4">Order Placed!</h2>
              <p className="text-gray-300 mb-2">Your order has been successfully booked.</p>
              <p className="text-gray-100 font-semibold text-lg mb-6">Order ID: <span className="text-green-400">{lastOrderId}</span></p>
              <button
                onClick={() => handleNavigate(Page.Home)}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
              >
                Done
              </button>
            </div>
          </div>
        );
      case Page.CompleteOrder:
        return <CompleteOrderScreen orders={employeeOrders} onCompleteOrder={completeOrder} onBack={() => handleNavigate(Page.Home)} />;
      case Page.AddStock:
        return <AddStockScreen stock={stock} onUpdateStock={updateStock} onBack={() => handleNavigate(Page.Home)} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} onLogout={handleLogout} onBackToHome={onBackToHome} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      {renderPage()}
    </div>
  );
};

export default EmployeeApp;