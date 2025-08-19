import { Pagination } from '@/components/custom/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ArrowDown, ArrowUp, ArrowUpDown, Lock, Map, Plus, Search, Unlock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useState } from 'react';

const breadcrumbs = [
    {
        title: 'Carts',
        href: '/carts',
    },
];

interface Carts {
    id: number;
    cart_type: string;
    cart_number: string;
    medi_lock: string;
    supply_lock: string;
    last_checked_date: string;
    qr_code: string;
    location_details: {
        location_name: string;
    };
}

interface LinkProps {
    active: boolean;
    label: string;
    url: string | null;
}

interface CartsPagination {
    data: Carts[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
    path: string;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    search?: string;
    sort_field?: string;
    sort_direction?: string;
}

interface Locations {
    id: number;
    location_name: string;
}

interface PageProps {
    carts: CartsPagination;
    locations?: Locations[];
    filters: {
        search: string;
        per_page: number;
        sort_field: string;
        sort_direction: string;
        locations?: string[];
        cart_type?: string;
    };
}

const Carts: React.FC<PageProps> = ({ carts, filters, locations = [] }) => {
    const { auth } = usePage().props;
    const role = auth.user.role;
    const [cartList, setCartList] = useState<Carts[]>(carts.data);
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const [locationFilter, setLocationFilter] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('locationFilter') || filters.locations?.[0] || '0';
        }
        return filters.locations?.[0] || '0';
    });

    const [typeFilter, setTypeFilter] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('typeFilter') || filters.cart_type || 'All';
        }
        return filters.cart_type || 'All';
    });

    const { CARTTYPE } = usePage().props;

    useEffect(() => {
        if (carts?.data) {
            setCartList(carts.data);
        }
    }, [carts.data]);

    useEffect(() => {
        localStorage.setItem('locationFilter', locationFilter);
    }, [locationFilter]);

    useEffect(() => {
        localStorage.setItem('typeFilter', typeFilter);
    }, [typeFilter]);

    const { data, setData } = useForm({
        search: filters.search || '',
        per_page: filters.per_page || '15',
        sort_field: filters.sort_field || '',
        sort_direction: filters.sort_direction || 'asc',
    });

    const updateFilters = (
        newFilters: Partial<{
            search: string;
            per_page: string;
            sort_field: string;
            sort_direction: string;
            location: string;
            cart_type: string;
        }>,
    ) => {
        const updatedQuery = {
            search: newFilters.search ?? filters.search,
            per_page: newFilters.per_page ?? filters.per_page,
            sort_field: newFilters.sort_field ?? filters.sort_field,
            sort_direction: newFilters.sort_direction ?? filters.sort_direction,
            location: newFilters.location ?? locationFilter,
            cart_type: newFilters.cart_type ?? typeFilter,
        };

        // Remove empty values from the query
        Object.keys(updatedQuery).forEach((key) => {
            const val = updatedQuery[key as keyof typeof updatedQuery];
            if (val === '' || val === null || val === undefined || val === 'All' || val === '0') {
                delete updatedQuery[key as keyof typeof updatedQuery];
            }
        });

        router.get(route(role + '.carts.index'), updatedQuery, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        setTimeout(() => updateFilters({}), 1);
    }, []);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        setData('search', value);
        updateFilters({ search: value });
    };

    const handleLocationFilter = (value: string) => {
        setLocationFilter(value);
        updateFilters({ location: value });
    };

    const handleTypeFilter = (value: string) => {
        setTypeFilter(value);
        updateFilters({ cart_type: value });
    };

    const handleSort = (field: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (filters.sort_field === field && filters.sort_direction === 'asc') {
            direction = 'desc';
        }
        setData('sort_field', field);
        setData('sort_direction', direction);
        updateFilters({ sort_field: field, sort_direction: direction });
    };

    const getSortIcon = (field: string) => {
        if (filters.sort_field !== field) {
            return <ArrowUpDown className="ml-1 h-4 w-4" />;
        }
        return filters.sort_direction === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Carts" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Cart Management</h1>
                    </div>
                    {role === 'admin' && (
                        <Button onClick={() => router.visit(route(role + '.carts.create'))} className="w-36 bg-primary shadow-lg hover:bg-primary/90">
                            <Plus className="mr-2 h-5 w-5" />
                            Add New Cart
                        </Button>
                    )}
                </div>

                <Card>
                    <CardContent className="p-2 lg:p-4">
                        <div className="space-y-6">
                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="relative flex-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Search size={18} className="text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Search carts..."
                                        value={searchValue}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full pl-10"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <Select value={locationFilter} onValueChange={handleLocationFilter}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="All Locations" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">All Locations</SelectItem> {/* Updated value prop */}
                                            {locations.map((location) => (
                                                <SelectItem key={location.id} value={location.id.toString()}>
                                                    {location.location_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={typeFilter} onValueChange={handleTypeFilter}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="All Types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Types</SelectItem> {/* Updated value prop */}
                                            {CARTTYPE.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={data.per_page}
                                        onValueChange={(value) => {
                                            setData('per_page', value);
                                            updateFilters({ per_page: value }); // Call updateFilters directly here
                                        }}
                                    >
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Select Per Page" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="15">15</SelectItem>
                                                <SelectItem value="25">25</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                                <SelectItem value="100">100</SelectItem>
                                                <SelectItem value="All">All</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 overflow-x-auto rounded-md">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase">QR</th>
                                        <th
                                            className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase hover:bg-gray-100 dark:hover:bg-gray-600"
                                            onClick={() => handleSort('cart_type')}
                                        >
                                            <div className="flex items-center">
                                                Cart Type
                                                {getSortIcon('cart_type')}
                                            </div>
                                        </th>
                                        <th
                                            className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase hover:bg-gray-100 dark:hover:bg-gray-600"
                                            onClick={() => handleSort('cart_number')}
                                        >
                                            <div className="flex items-center">
                                                Cart Number
                                                {getSortIcon('cart_number')}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase">Medi Lock</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase">Supply Lock</th>
                                        <th
                                            className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase hover:bg-gray-100 dark:hover:bg-gray-600"
                                            onClick={() => handleSort('last_checked_date')}
                                        >
                                            <div className="flex items-center">
                                                Last Checked
                                                {getSortIcon('last_checked_date')}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 dark:text-gray-100 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-transparent">
                                    {cartList.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="p-4 text-center font-bold text-red-600">
                                                No cart found. Add one to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        cartList.map((cart) => (
                                            <tr key={cart.id} className="transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <QRCodeSVG size={40} value={cart.qr_code} className="flex-shrink-0 cursor-pointer" />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm">{cart.cart_type}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium">{cart.cart_number}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Map size={16} className="mr-2 text-gray-400" />
                                                        <span className="text-sm">{cart.location_details?.location_name || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            cart.medi_lock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {cart.medi_lock ? (
                                                            <>
                                                                <Lock size={12} className="mr-1" />
                                                                {cart.medi_lock}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Unlock size={12} className="mr-1" />
                                                                Unlocked
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            cart.supply_lock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {cart.supply_lock ? (
                                                            <>
                                                                <Lock size={12} className="mr-1" />
                                                                {cart.supply_lock}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Unlock size={12} className="mr-1" />
                                                                Unlocked
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                    {cart.last_checked_date ? dayjs(cart.last_checked_date).format('MMM DD, YYYY') : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.visit(route(role + '.carts.show', cart.id))}
                                                        className="cursor-pointer text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200"
                                                    >
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            <Pagination data={carts} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Carts;
