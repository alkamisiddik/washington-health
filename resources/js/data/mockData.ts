import { v4 as uuidv4 } from 'uuid';
import { addDays, format } from 'date-fns';
import { Cart, CartType, Equipment, ExpiryAlert, LocationSummary } from '../types';

export const cartTypes: CartType[] = [
  {
    id: uuidv4(),
    name: 'Crash Cart',
    drawerConfig: ['Drawer 1', 'Drawer 2', 'Drawer 3', 'Drawer 4', 'Drawer 5', 'Drawer 6'],
  },
  {
    id: uuidv4(),
    name: 'Urology Cart',
    drawerConfig: ['Top Drawer', 'Drawer 1', 'Drawer 2', 'Drawer 3', 'Drawer 4'],
  },
  {
    id: uuidv4(),
    name: 'Broselow Cart',
    drawerConfig: ['Top Drawer', 'Middle Drawer', 'Bottom Drawer'],
  },
  {
    id: uuidv4(),
    name: 'Anesthesia Cart',
    drawerConfig: ['Drawer 1', 'Drawer 2', 'Drawer 3', 'Drawer 4'],
  },
];

// Generate random expiry dates (between 1 day and 1 year from now)
const randomExpiryDate = () => {
  const daysToAdd = Math.floor(Math.random() * 365) + 1;
  return format(addDays(new Date(), daysToAdd), 'yyyy-MM-dd');
};

// Generate equipment for a drawer
const generateEquipment = (drawerId: string): Equipment[] => {
  const equipmentCount = Math.floor(Math.random() * 5) + 1;
  const equipment: Equipment[] = [];

  const equipmentNames = [
    'Syringe 5ml', 'Syringe 10ml', 'IV Catheter', 'Bandages', 
    'Sterile Gloves', 'Face Masks', 'Alcohol Swabs', 'Gauze Pads',
    'Surgical Tape', 'Suture Kit', 'Scalpel Blades', 'Stethoscope',
    'Blood Pressure Cuff', 'Oxygen Mask', 'Nasal Cannula', 'Endotracheal Tube'
  ];

  for (let i = 0; i < equipmentCount; i++) {
    equipment.push({
      id: uuidv4(),
      drawerId,
      name: equipmentNames[Math.floor(Math.random() * equipmentNames.length)],
      quantity: Math.floor(Math.random() * 20) + 1,
      expiryDate: randomExpiryDate(),
      lastUpdated: format(new Date(), 'yyyy-MM-dd'),
    });
  }

  return equipment;
};

// Generate carts with drawers and equipment
export const generateCarts = (count: number = 10): Cart[] => {
  const locations = ['ER', 'ICU', 'OR', 'Pediatrics', 'General Ward', 'Cardiology'];
  const carts: Cart[] = [];

  for (let i = 0; i < count; i++) {
    const cartTypeId = cartTypes[Math.floor(Math.random() * cartTypes.length)].id;
    const cartType = cartTypes.find(type => type.id === cartTypeId)!;
    
    const cart: Cart = {
      id: uuidv4(),
      cartTypeId,
      cartNumber: `${cartType.name.substring(0, 2).toUpperCase()}${100 + i}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      qrCode: uuidv4(),
      mediLock: Math.random() > 0.5,
      supplyLock: Math.random() > 0.5,
      lastChecked: format(new Date(), 'yyyy-MM-dd'),
      drawers: [],
    };

    // Add drawers based on cart type configuration
    cartType.drawerConfig.forEach(drawerName => {
      const drawerId = uuidv4();
      cart.drawers.push({
        id: drawerId,
        cartId: cart.id,
        name: drawerName,
        equipment: generateEquipment(drawerId),
      });
    });

    carts.push(cart);
  }

  return carts;
};

// Mock data for the application
export const mockCarts = generateCarts(15);

// Helper functions for dashboard data
export const getLocationSummary = (carts: Cart[]): LocationSummary[] => {
  const summary: Record<string, number> = {};
  
  carts.forEach(cart => {
    summary[cart.location] = (summary[cart.location] || 0) + 1;
  });
  
  return Object.entries(summary).map(([location, count]) => ({
    location,
    count,
  }));
};

export const getExpiryAlerts = (carts: Cart[], days: number = 30): ExpiryAlert[] => {
  const alerts: ExpiryAlert[] = [];
  const today = new Date();
  
  carts.forEach(cart => {
    cart.drawers.forEach(drawer => {
      drawer.equipment.forEach(equipment => {
        const expiryDate = new Date(equipment.expiryDate);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= days) {
          alerts.push({
            cartId: cart.id,
            cartNumber: cart.cartNumber,
            location: cart.location,
            equipmentName: equipment.name,
            expiryDate: equipment.expiryDate,
            daysRemaining: diffDays,
          });
        }
      });
    });
  });
  
  // Sort by days remaining (ascending)
  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
};