import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type CartType = {
  id: string;
  name: string;
  drawerConfig: string[];
};

export type Cart = {
  id: string;
  cartTypeId: string;
  cartNumber: string;
  location: string;
  qrCode: string;
  mediLock: boolean;
  supplyLock: boolean;
  lastChecked: string;
  drawers: Drawer[];
};

export type Drawer = {
  id: string;
  cartId: string;
  name: string;
  equipment: Equipment[];
};

export type Equipment = {
  id: string;
  drawerId: string;
  name: string;
  quantity: number;
  expiryDate: string;
  lastUpdated: string;
};

export type LocationSummary = {
  location: string;
  count: number;
};

export type ExpiryAlert = {
  cartId: string;
  cartNumber: string;
  location: string;
  equipmentName: string;
  expiryDate: string;
  daysRemaining: number;
};
