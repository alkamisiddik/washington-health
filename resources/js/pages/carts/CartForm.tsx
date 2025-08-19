import { Autocomplete } from '@/components/ui/autocomplete';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Camera, List, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';
import React from 'react';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add new Cart',
        href: '/carts',
    },
];

const CartForm = () => {
    const { CARTTYPE } = usePage().props;
    const cartTypesOptions = CARTTYPE.map((item) => ({ value: item, label: item }));

    const { data, setData, post, processing, errors, reset } = useForm({
        cart_type: '',
        cart_number: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/carts', {
            onSuccess: () => {
                toast.success('Cart created successfully');
                reset();
            },
            onError: (e) => {
                console.log(e);
                toast.error('Failed to create Cart');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create new Cart" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create new Cart</h1>
                    </div>
                    <Button onClick={() => router.visit(route('admin.carts.index'))} className="w-28 bg-primary shadow-lg hover:bg-primary/90">
                        <List className="mr-2 h-5 w-5" />
                        Cart List
                    </Button>
                </div>
                <Card className="mx-auto max-w-2xl">
                    <div className="rounded-lg bg-white dark:bg-transparent p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="search" className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Cart Type <span className="text-destructive">*</span>
                                        </label>
                                        <Autocomplete
                                            options={cartTypesOptions}
                                            value={data.cart_type?.toString() || ''}
                                            onValueChange={(value) => setData('cart_type', value)}
                                            placeholder="Select Cart Type"
                                            searchPlaceholder="Search cart..."
                                            emptyText="No cart found."
                                        />
                                        {errors.cart_type && <p className="mt-1 text-sm text-red-500">{errors.cart_type}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="search" className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Cart Number <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="cartNumber"
                                            name="cartNumber"
                                            value={data.cart_number}
                                            onChange={(e) => setData('cart_number', e.target.value)}
                                            placeholder="e.g., CR101"
                                            className={`w-full rounded-md border border-gray-800 bg-transparent p-1.5 px-4 pl-2 ${errors.cart_number ? 'border-warning-500' : 'border-gray-300'}`}
                                        />
                                        {errors.cart_number && <p className="mt-1 text-sm text-red-500">{errors.cart_number}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex gap-3">
                                        <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90">
                                            {processing ? 'Saving...' : 'Create Cart'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
};

export default CartForm;
