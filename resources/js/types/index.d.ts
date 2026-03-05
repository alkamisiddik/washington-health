import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    unread_notifications_count: number;
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

export interface ChartItem {
    date: string;
    count: number;
}

export interface DashboardProps {
    stats: {
        total_today: number;
        in_progress: number;
        completed_today: number;
        pending: number;
        assigned_today: number;
        completed_all: number;
        total_requests: number;
        completed: number;
    };
    recent_deliveries: Delivery[];
    chart_data: ChartItem[];
}

export interface ReportProps {
    totalDeliveries: number;
    completedDeliveries: number;
    pendingDeliveries: number;
    inProgressDeliveries: number;
    deliveriesByDriver: { id: number; name: string; deliveries_as_driver_count: number }[];
    recentCompleted: { id: number; pickup_location: string; delivery_location: string; driver?: { name: string }; end_time: string }[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Vehicle {
    id: number;
    vehicle_number: string;
    description: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DriverChecklist {
    id: number;
    delivery_id: number;
    vehicle_clean: boolean;
    hvac_running: boolean;
    logger_active: boolean;
    separation_verified: boolean;
    containers_sealed: boolean;
    logs_completed: boolean;
    chain_of_custody_signed: boolean;
    created_at: string;
    updated_at: string;
    delivery?: Delivery;
}

export interface EnvironmentLog {
    id: number;
    delivery_id: number;
    start_temp: number | null;
    start_humidity: number | null;
    mid_temp: number | null;
    mid_humidity: number | null;
    end_temp: number | null;
    end_humidity: number | null;
    extra_logs: Record<string, unknown>[] | null;
    start_in_range: boolean;
    mid_in_range: boolean;
    end_in_range: boolean;
    corrective_action: string | null;
    created_at: string;
    updated_at: string;
    delivery?: Delivery;
}

export interface ChainOfCustody {
    id: number;
    delivery_id: number;
    container_ids: string | null;
    condition: string | null;
    pickup_department: string | null;
    delivery_department: string | null;
    pickup_time: string | null;
    delivery_time: string | null;
    driver_signature: string | null;
    driver_signed_at: string | null;
    receiver_signature: string | null;
    receiver_signed_at: string | null;
    exceptions: string | null;
    created_at: string;
    updated_at: string;
    delivery?: Delivery;
}

export interface Delivery {
    id: number;
    requested_by: number;
    driver_id: number | null;
    vehicle_id: number | null;
    pickup_location: string;
    delivery_location: string;
    scheduled_time: string;
    pickup_time: string | null;
    start_time: string | null;
    end_time: string | null;
    duration_minutes: number | null;
    status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;

    officer?: User;
    driver?: User;
    vehicle?: Vehicle;
    checklist?: DriverChecklist;
    environment_log?: EnvironmentLog;
    chain_of_custody?: ChainOfCustody;
}

export interface AppNotification {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: Record<string, unknown>;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}
