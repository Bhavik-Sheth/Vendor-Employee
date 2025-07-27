import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, StockItem, Order, EmployeeOrder } from '../types';
import { PRODUCTS } from '../constants';

interface SharedState {
  products: Product[];
  stock: StockItem[];
  vendorOrders: Order[];
  employeeOrders: EmployeeOrder[];
  updateStock: (itemId: string, newCount: number) => void;
  addVendorOrder: (order: Order) => void;
  addEmployeeOrder: (order: EmployeeOrder) => void;
  completeOrder: (orderId: string) => void;
  syncProductStock: () => void;
}

const SharedStateContext = createContext<SharedState | undefined>(undefined);

const INITIAL_STOCK: StockItem[] = [
  { id: 'p1', name: 'Tomato', count: 100 },
  { id: 'p2', name: 'Onion', count: 100 },
  { id: 'p3', name: 'Potato', count: 80 },
  { id: 'p4', name: 'Coriander', count: 50 },
  { id: 'p5', name: 'Green Chillies', count: 30 },
  { id: 'p6', name: 'Lemon', count: 40 },
  { id: 'p7', name: 'Maida Flour', count: 60 },
  { id: 'p8', name: 'Cooking Oil', count: 90 },
];

export const SharedStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [vendorOrders, setVendorOrders] = useState<Order[]>([]);
  const [employeeOrders, setEmployeeOrders] = useState<EmployeeOrder[]>([]);

  const updateStock = useCallback((itemId: string, newCount: number) => {
    setStock(prevStock =>
      prevStock.map(item =>
        item.id === itemId ? { ...item, count: Math.max(0, newCount) } : item
      )
    );
    syncProductStock();
  }, []);

  const syncProductStock = useCallback(() => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        const stockItem = stock.find(s => s.id === product.id);
        return stockItem
          ? { ...product, inStock: stockItem.count > 0 }
          : product;
      })
    );
  }, [stock]);

  const addVendorOrder = useCallback((order: Order) => {
    setVendorOrders(prev => [order, ...prev]);
    
    // Convert vendor order to employee order format
    const employeeOrder: EmployeeOrder = {
      id: order.id,
      items: order.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          itemId: item.productId,
          name: product?.name || 'Unknown Item',
          quantity: item.quantity
        };
      }),
      bookingTime: order.pickupTime,
      status: 'pending'
    };
    
    setEmployeeOrders(prev => [employeeOrder, ...prev]);
  }, [products]);

  const addEmployeeOrder = useCallback((order: EmployeeOrder) => {
    setEmployeeOrders(prev => [order, ...prev]);
  }, []);

  const completeOrder = useCallback((orderId: string) => {
    const orderToComplete = employeeOrders.find(order => order.id === orderId);

    if (!orderToComplete) {
      console.error(`Order with id ${orderId} not found.`);
      return;
    }
    
    // Deduct items from stock when an order is completed
    setStock(prevStock => {
      const stockMap = new Map(prevStock.map(item => [item.id, {...item}]));
      
      for (const orderedItem of orderToComplete.items) {
        const stockItem = stockMap.get(orderedItem.itemId);
        if (stockItem) {
          stockItem.count = Math.max(0, stockItem.count - orderedItem.quantity);
        }
      }
      
      return Array.from(stockMap.values());
    });

    // Mark order as completed
    setEmployeeOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'completed' } : order
      )
    );

    // Also update vendor orders if it exists
    setVendorOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'completed' } : order
      )
    );

    syncProductStock();
  }, [employeeOrders, syncProductStock]);

  // Sync product stock whenever stock changes
  React.useEffect(() => {
    syncProductStock();
  }, [stock, syncProductStock]);

  const value: SharedState = {
    products,
    stock,
    vendorOrders,
    employeeOrders,
    updateStock,
    addVendorOrder,
    addEmployeeOrder,
    completeOrder,
    syncProductStock
  };

  return (
    <SharedStateContext.Provider value={value}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = (): SharedState => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error('useSharedState must be used within a SharedStateProvider');
  }
  return context;
};