import React from 'react';
import { AppMode } from '../types';

interface HomeScreenProps {
  onModeChange: (mode: AppMode) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onModeChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fresh-green-light to-fresh-gray-light flex items-center justify-center p-8">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-2xl text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-fresh-green-dark mb-4">FreshStock</h1>
          <p className="text-xl text-fresh-gray-dark">
            Complete Supply Chain Management System
          </p>
          <p className="text-lg text-fresh-gray-dark mt-2">
            ताज़ा सामग्री, आसान प्रबंधन
          </p>
        </div>

        <div className="space-y-6">
          <button
            onClick={() => onModeChange(AppMode.Vendor)}
            className="w-full bg-fresh-green hover:bg-fresh-green-dark text-white font-bold py-6 px-8 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
              </svg>
              <span>Food Vendor Portal</span>
            </div>
            <p className="text-sm mt-2 opacity-90">Order fresh ingredients for your business</p>
          </button>

          <button
            onClick={() => onModeChange(AppMode.Employee)}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-6 px-8 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Outlet Employee Portal</span>
            </div>
            <p className="text-sm mt-2 opacity-90">Manage orders and inventory</p>
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Seamlessly integrated system for vendors and employees
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;