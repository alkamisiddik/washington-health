import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { Link, usePage } from "@inertiajs/react"
import { LayoutGrid, Users, Settings, Users2 } from 'lucide-react';
import AppLogo from "./app-logo"
import { NavMain } from '@/components/nav-main';
import { NavMainEnhanced } from '@/components/nav-main-enhanced';
import { NavUser } from '@/components/nav-user';

const nurseNavItems = [
    {
        title: "Dashboard",
        href: "/nurse/dashboard",
        icon: LayoutGrid,
    },
    {
        title: "Tracker Management",
        href: "/nurse/trackers",
        icon: Settings,
    },
]

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
        title: "Tracker Management",
        href: "/admin/trackers",
        icon: Settings,
    },
    {
        title: "Visitor Log",
        href: "/admin/visitorLog",
        icon: Users2,
    },
    // {
    //     title: "Tracker Management",
    //     href: "#",
    //     icon: Settings,
    //     items: [
    //         {
    //             title: "Add Tracker",
    //             href: "/admin/tracker/create",
    //             icon: PlusSquare,
    //         },
    //         {
    //             title: "Tracker List",
    //             href: "/admin/tracker",
    //             icon: List,
    //         },
    //     ],
    // },
]

export function AppSidebar() {
    const { props } = usePage()
    const userRole = props.auth?.user?.role || "nurse"
    const mainNavItems = userRole === "admin" ? adminNavItems : nurseNavItems
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
                {/*<NavMain items={mainNavItems} />*/}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
