import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import dayjs from 'dayjs';
import { Activity, AlertTriangle, Clock, Plus, PlusCircle, Search } from 'lucide-react';
import React from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Cart {
    id: number;
    cart_type: string;
    cart_number: string;
    last_checked_date: string;
    location_id: string;
    location_details: Location;
    user_details: { name: string };
    length: number;
}

interface Location {
    id: number;
    location_name: string;
}

interface Items {
    id: number;
    cart_id: number;
    item_name: string;
    quantity: number;
    expiry_date: string;
    status: string;
    cart_details: Cart;
    drawer: string;
}

type Props = {
    carts: Cart[];
    items: Items[];
};

const Dashboard: React.FC<Props> = ({ carts, items, day_limit }) => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const gridColor = isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
    const borderColor = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';

    const { auth } = usePage().props;
    const role = auth.user.role;
    const cartCountsByLocation: { [locationId: number]: { locationName: string; count: number } } = {};
    carts.forEach((cart) => {
        const locationId = cart.location_details?.id;
        const locationName = cart.location_details?.location_name || 'Unknown';

        if (locationId !== undefined) {
            if (cartCountsByLocation[locationId]) {
                cartCountsByLocation[locationId].count += 1;
            } else {
                cartCountsByLocation[locationId] = {
                    locationName: locationName,
                    count: 1,
                };
            }
        }
    });

    const uniqueLocationIds = [...new Set(carts.map((cart) => cart.location_id))];
    const totalLocations = uniqueLocationIds.length;

    const generateColor = (index: number) => {
        const hue = (index * 137.508) % 360;
        return `hsl(${hue}, 65%, 60%)`;
    };

    const colors = Array.from({ length: totalLocations }, (_, i) => generateColor(i));

    const data = {
        labels: Object.values(cartCountsByLocation).map((loc) => loc.locationName),
        datasets: [
            {
                label: 'Number of Items',
                data: Object.values(cartCountsByLocation).map((loc) => loc.count),
                backgroundColor: carts.map((_, index) => colors[index % colors.length]),
                borderColor: carts.map((_, index) => colors[index % colors.length].replace('0.7', '1')),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: false,
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value} carts`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    borderColor: borderColor,
                    color: gridColor,
                },
                ticks: {
                    font: {
                        size: 12,
                    },
                },
            },
            y: {
                grid: {
                    borderColor: borderColor,
                    color: gridColor,
                },
            },
        },
    };

    const getSeverityColor = (daysRemaining: number): string => {
        if (daysRemaining <= 7) return 'text-red-600 bg-red-50';
        if (daysRemaining <= 14) return 'text-orange-600 bg-orange-50';
        return 'text-yellow-600 bg-yellow-50';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard</h1>
                    </div>
                    {role === 'admin' && (
                        <Button onClick={() => router.visit(route(role + '.carts.create'))} className="w-36 bg-primary shadow-lg hover:bg-primary/90">
                            <Plus className="mr-2 h-5 w-5" />
                            Add New Cart
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-lg border bg-transparent p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-100">Total Carts</h3>
                                    <span className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                                        <Activity size={16} />
                                    </span>
                                </div>
                                <p className="mt-2 text-2xl font-bold">{carts.length}</p>
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-100">Across locations</div>
                            </div>

                            <div className="rounded-lg border bg-transparent p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-100">Expiring Soon</h3>
                                    <span className="rounded-full bg-yellow-50 p-2 text-yellow-600">
                                        <Clock size={16} color="Red" />
                                    </span>
                                </div>
                                <p className="mt-2 text-2xl font-bold">{items.length}</p>
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-100">Items expiring in next 30 days</div>
                            </div>

                            <div className="rounded-lg border bg-transparent p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-100">Last Updated</h3>
                                    <span className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                                        <Clock size={16} />
                                    </span>
                                </div>
                                <p className="mt-2 text-2xl font-bold">
                                    {carts[0].last_checked_date ? dayjs(carts[0].last_checked_date).format('MMM DD, YYYY') : '-'}
                                </p>
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-100"> Updated By: {carts[0].user_details.name}</div>
                            </div>
                        </div>
                        <div className="mb-6 rounded-lg border bg-transparent p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-medium">Cart Distribution</h3>
                                <div className="text-sm text-gray-500 dark:text-gray-100">By Location</div>
                            </div>

                            <div className="flex flex-col gap-6 md:flex-row">
                                {/* Chart */}
                                <div className="w-full">
                                    <div className="flex h-auto items-center justify-center rounded-lg border p-4 shadow-sm">
                                        <Bar data={data} options={options} height="200px" />
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="w-full md:w-1/2">
                                    <div className="flex h-72 flex-col overflow-hidden rounded-lg border shadow-sm">
                                        <table className="w-full table-auto border-collapse text-sm">
                                            <thead className="bg-gray-100 dark:bg-indigo-800/60">
                                                <tr className="border-b text-center">
                                                    <th className="px-4 py-2">Color</th>
                                                    <th className="px-4 py-2">Location</th>
                                                    <th className="px-4 py-2">Cart Count</th>
                                                </tr>
                                            </thead>
                                        </table>
                                        {/* Scrollable body */}
                                        <div className="flex-1 overflow-y-auto">
                                            <table className="w-full table-auto border-collapse text-sm">
                                                <tbody>
                                                    {Object.values(cartCountsByLocation).map((loc, index) => (
                                                        <tr key={index} className="border-b text-center hover:bg-gray-100 dark:hover:bg-gray-700">
                                                            <td className="px-4 py-2">
                                                                <span
                                                                    className="inline-block h-4 w-4 rounded"
                                                                    style={{ backgroundColor: colors[index % colors.length] }}
                                                                ></span>
                                                            </td>
                                                            <td className="px-4 py-2">{loc.locationName}</td>
                                                            <td className="px-4 py-2">{loc.count}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-transparent p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-medium">Quick Actions</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div
                                    className="flex cursor-pointer items-center rounded-lg bg-gray-100 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800/90"
                                    onClick={() => router.visit(route(role + '.scan'))}
                                >
                                    <div className="mr-4 rounded-lg bg-indigo-200 p-3">
                                        <Search size={20} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Scan QR Code</h4>
                                        <p className="text-sm text-gray-500">Update equipment quickly</p>
                                    </div>
                                </div>
                                {role === 'admin' && (
                                    <div
                                        className="flex cursor-pointer items-center rounded-lg bg-gray-100 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800/90"
                                        onClick={() => router.visit(route(role + '.carts.create'))}
                                    >
                                        <div className="mr-4 rounded-lg bg-indigo-200 p-3">
                                            <PlusCircle size={20} className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Add New Cart</h4>
                                            <p className="text-sm text-gray-500">Register a new cart</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="h-full rounded-lg border bg-transparent shadow-sm">
                            <div className="border-b p-4">
                                <h3 className="text-lg font-medium">Expiry Alerts</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-300">Items expiring in next 30 days</p>
                            </div>
                            <div className="max-h-[600px] overflow-y-auto p-2">
                                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {items.map((alert, index) => (
                                        <li
                                            key={index}
                                            className="animate-slide-in cursor-pointer py-3"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div
                                                onClick={() =>
                                                    router.visit(route(role + '.carts.show', alert.cart_id), {
                                                        data: { drawer: alert.drawer },
                                                        preserveScroll: true,
                                                    })
                                                }
                                                className="flex items-start rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <div
                                                    className={`mt-5 mr-3 rounded-full p-2 ${getSeverityColor(dayjs(alert.expiry_date).diff(dayjs(), 'day'))}`}
                                                >
                                                    {dayjs(alert.expiry_date).diff(dayjs(), 'day') <= 7 ? (
                                                        <AlertTriangle size={18} />
                                                    ) : (
                                                        <Clock size={18} />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex justify-between">
                                                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {alert.item_name}
                                                        </p>
                                                        <span className="text-xs font-medium">
                                                            {dayjs(alert.expiry_date).diff(dayjs(), 'day')}{' '}
                                                            {dayjs(alert.expiry_date).diff(dayjs(), 'day') === 1 ? 'day' : 'days'} left
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                                                        Cart: {alert.cart_details.cart_number} | Location:{' '}
                                                        {alert.cart_details.location_details.location_name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">{alert.drawer}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-300">
                                                        Expires: {dayjs(alert.expiry_date).format('MMM DD, YYYY')}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
