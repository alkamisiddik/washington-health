import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Cart, CartType, Equipment, Drawer } from '@/types';
import { cartTypes, mockCarts } from '@/data/mockData';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

interface CartContextType {
  carts: Cart[];
  cartTypes: CartType[];
  loading: boolean;
  addCart: (cart: Omit<Cart, 'id' | 'drawers'>) => Cart;
  updateCart: (cart: Cart) => void;
  deleteCart: (cartId: string) => void;
  getCartById: (cartId: string) => Cart | undefined;
  addEquipment: (drawerId: string, equipment: Omit<Equipment, 'id' | 'drawerId' | 'lastUpdated'>) => void;
  updateEquipment: (equipment: Equipment) => void;
  deleteEquipment: (equipmentId: string) => void;
  updateLockStatus: (cartId: string, lockType: 'mediLock' | 'supplyLock', status: boolean) => void;
  getCartByQrCode: (qrCode: string) => Cart | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCarts(mockCarts);
      setLoading(false);
    }, 500);
  }, []);

  const addCart = (cartData: Omit<Cart, 'id' | 'drawers'>) => {
    const cartType = cartTypes.find(type => type.id === cartData.cartTypeId);

    if (!cartType) {
      throw new Error('Invalid cart type');
    }

    const newCart: Cart = {
      ...cartData,
      id: uuidv4(),
      lastChecked: format(new Date(), 'yyyy-MM-dd'),
      drawers: cartType.drawerConfig.map(drawerName => ({
        id: uuidv4(),
        cartId: '',  // Will be updated below
        name: drawerName,
        equipment: [],
      })),
    };

    // Update the cartId for each drawer
    newCart.drawers.forEach(drawer => {
      drawer.cartId = newCart.id;
    });

    setCarts(prevCarts => [...prevCarts, newCart]);
    return newCart;
  };

  const updateCart = (updatedCart: Cart) => {
    setCarts(prevCarts =>
      prevCarts.map(cart =>
        cart.id === updatedCart.id ? updatedCart : cart
      )
    );
  };

  const deleteCart = (cartId: string) => {
    setCarts(prevCarts => prevCarts.filter(cart => cart.id !== cartId));
  };

  const getCartById = (cartId: string) => {
    return carts.find(cart => cart.id === cartId);
  };

  const addEquipment = (drawerId: string, equipmentData: Omit<Equipment, 'id' | 'drawerId' | 'lastUpdated'>) => {
    const newEquipment: Equipment = {
      ...equipmentData,
      id: uuidv4(),
      drawerId,
      lastUpdated: format(new Date(), 'yyyy-MM-dd'),
    };

    setCarts(prevCarts =>
      prevCarts.map(cart => {
        const drawerIndex = cart.drawers.findIndex(drawer => drawer.id === drawerId);

        if (drawerIndex === -1) return cart;

        const updatedDrawers = [...cart.drawers];
        updatedDrawers[drawerIndex] = {
          ...updatedDrawers[drawerIndex],
          equipment: [...updatedDrawers[drawerIndex].equipment, newEquipment],
        };

        return {
          ...cart,
          drawers: updatedDrawers,
        };
      })
    );
  };

  const updateEquipment = (updatedEquipment: Equipment) => {
    setCarts(prevCarts =>
      prevCarts.map(cart => {
        const updatedDrawers = cart.drawers.map(drawer => {
          if (drawer.id !== updatedEquipment.drawerId) return drawer;

          return {
            ...drawer,
            equipment: drawer.equipment.map(equipment =>
              equipment.id === updatedEquipment.id
                ? { ...updatedEquipment, lastUpdated: format(new Date(), 'yyyy-MM-dd') }
                : equipment
            ),
          };
        });

        return {
          ...cart,
          drawers: updatedDrawers,
        };
      })
    );
  };

  const deleteEquipment = (equipmentId: string) => {
    setCarts(prevCarts =>
      prevCarts.map(cart => {
        const updatedDrawers = cart.drawers.map(drawer => ({
          ...drawer,
          equipment: drawer.equipment.filter(equipment => equipment.id !== equipmentId),
        }));

        return {
          ...cart,
          drawers: updatedDrawers,
        };
      })
    );
  };

  const updateLockStatus = (cartId: string, lockType: 'mediLock' | 'supplyLock', status: boolean) => {
    setCarts(prevCarts =>
      prevCarts.map(cart =>
        cart.id === cartId
          ? { ...cart, [lockType]: status, lastChecked: format(new Date(), 'yyyy-MM-dd') }
          : cart
      )
    );
  };

  const getCartByQrCode = (qrCode: string) => {
    return carts.find(cart => cart.qrCode === qrCode);
  };

  return (
    <CartContext.Provider
      value={{
        carts,
        cartTypes,
        loading,
        addCart,
        updateCart,
        deleteCart,
        getCartById,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        updateLockStatus,
        getCartByQrCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
    console.log(context);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
