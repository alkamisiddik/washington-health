import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { Link, usePage } from "@inertiajs/react"
import { LayoutGrid, Users, Truck, FileText } from 'lucide-react';
import AppLogo from "./app-logo"
import { NavMainEnhanced } from '@/components/nav-main-enhanced';
import { NavUser } from '@/components/nav-user';

const adminNavItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutGrid,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Deliveries",
        href: "/admin/deliveries",
        icon: Truck,
    },
    {
        title: "Vehicles",
        href: "/admin/vehicles",
        icon: Truck,
    },
    {
        title: "Reports",
        href: "/admin/reports",
        icon: FileText,
    },
]

const officerNavItems = [
    {
        title: "Dashboard",
        href: "/officer/dashboard",
        icon: LayoutGrid,
    },
]

const driverNavItems = [
    {
        title: "Dashboard",
        href: "/driver/dashboard",
        icon: LayoutGrid,
    },
]

export function AppSidebar() {
    const { props } = usePage<{ auth: { user: { role: string } } }>();
    const userRole = props.auth?.user?.role || "driver"
    
    let mainNavItems = driverNavItems;
    if (userRole === "admin") mainNavItems = adminNavItems;
    if (userRole === "officer") mainNavItems = officerNavItems;

    const dashboardRoute = '/' + userRole + '/dashboard';
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardRoute} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMainEnhanced items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
