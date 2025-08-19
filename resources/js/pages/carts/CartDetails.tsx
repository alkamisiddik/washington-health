import { ConfirmDialog } from '@/components/custom/ConfirmDialog';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
    AlertCircle,
    CheckCircle,
    ChevronLeft,
    CircleCheckBig,
    CircleX,
    Edit,
    Lock,
    Map,
    Package,
    Pencil,
    Plus,
    Search,
    Trash2,
    Unlock,
    X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface Cart {
    id: number;
    cart_type: string;
    cart_number: string;
    medi_lock: string;
    supply_lock: string;
    last_checked_date: string;
    qr_code: string;
    location_details: Location;
}

interface Location {
    id: number;
    location_name: string;
}

interface Items {
    id: number;
    item_name: string;
    quantity: number;
    expire_date: string;
    status: string;
}

type Props = {
    cart: Cart;
    cartDrawers: string[];
    itemsDetails: Items[];
    locations: Location[];
};

type OptionType = {
    value: string;
    label: string;
};

const CartDetails: React.FC<Props> = ({ cart, cartDrawers, itemsDetails = [], locations = [] }) => {
    const { auth } = usePage().props;
    const role = auth.user.role;

    const [items, setItems] = useState(itemsDetails);
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1]);
    const drawerFromUrl = searchParams.get('drawer');
    const [selectedDrawer, setSelectedDrawer] = useState(() => (cartDrawers.includes(drawerFromUrl) ? drawerFromUrl : cartDrawers[0]));
    const [isEditing, setIsEditing] = useState(false);
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [isEditItemOpen, setIsEditItemOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationsOptions, setLocationsOptions] = useState(
        locations.map((item) => ({
            value: item.id.toString(),
            label: item.location_name,
        })),
    );

    const { CARTTYPE } = usePage().props as { CARTTYPE: string[] };
    const cartTypesOptions: OptionType[] = CARTTYPE.map((item) => ({
        value: item,
        label: item,
    }));

    // Form state for edit Cart
    const { data, setData, put, processing, errors } = useForm({
        cart_type: cart?.cart_type || '',
        cart_number: cart?.cart_number || '',
        medi_lock: cart?.medi_lock || '',
        supply_lock: cart?.supply_lock || '',
        location_id: cart?.location_details?.id || '',
    });

    const handleSubmit = async () => {
        try {
            put(route(role + '.carts.update', cart.id), {
                onSuccess: () => {
                    setIsEditing(false);
                },
                onError: (errors) => {
                    Object.keys(errors).forEach((key) => {
                        toast.error(errors[key]);
                    });
                },
            });
        } catch (error: any) {
            if (error.response?.data?.errors) {
                // Handle validation errors
                Object.keys(error.response.data.errors).forEach((key) => {
                    toast.error(error.response.data.errors[key][0]);
                });
            } else {
                toast.error('Failed to add item');
            }
        }
    };

    // Form state for new/edit item
    const [itemForm, setItemForm] = useState({
        item_name: '',
        quantity: '',
        expiry_date: '',
    });

    const handleAddItem = async () => {
        try {
            const response = await axios.post(`/${role}/cart-items`, {
                ...itemForm,
                drawer: selectedDrawer,
                cart_id: cart.id,
            });

            if (response.data.success) {
                // Update local state
                setItems((prev) => ({
                    ...prev,
                    [selectedDrawer]: [...(prev[selectedDrawer] || []), response.data.item],
                }));

                // Reset form
                setItemForm({ item_name: '', quantity: '', expiry_date: '' });
                setIsAddItemOpen(false);
                toast.success('Item added successfully');
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                // Handle validation errors
                Object.keys(error.response.data.errors).forEach((key) => {
                    toast.error(error.response.data.errors[key][0]);
                });
            } else {
                toast.error('Failed to add item');
            }
        }
    };

    const handleEditItem = async () => {
        try {
            const response = await axios.put(`/${role}/cart-items/${currentItem.id}`, {
                ...itemForm,
                drawer: selectedDrawer,
                cart_id: cart.id,
            });

            if (response.data.success) {
                // Update local state
                setItems((prev) => ({
                    ...prev,
                    [selectedDrawer]: (prev[selectedDrawer] || []).map((item) => (item.id === currentItem.id ? response.data.item : item)),
                }));

                // Reset form
                setItemForm({ item_name: '', quantity: '', expiry_date: '' });
                setIsEditItemOpen(false);
                setCurrentItem(null);
                toast.success('Item updated successfully');
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                Object.keys(error.response.data.errors).forEach((key) => {
                    toast.error(error.response.data.errors[key][0]);
                });
            } else {
                toast.error('Failed to update item');
            }
        }
    };

    const handleCreateNewLocation = async (newName: string) => {
        try {
            const response = await axios.post(role + '/locations', {
                location_name: newName,
            });

            const newLocation = response.data;
            // Update options
            console.log(newLocation);
            setLocationsOptions((prev) => [
                ...prev,
                {
                    value: newLocation.location.id.toString(),
                    label: newLocation.location.location_name,
                },
            ]);
            setData('location_id', newLocation.location.id.toString());
        } catch (error) {
            toast.error('Could not create location');
        }
    };

    const handleDeleteItem = async (itemId: number) => {
        try {
            await axios.delete(role + `/cart-items/${itemId}`);

            setItems((prev) => ({
                ...prev,
                [selectedDrawer]: (prev[selectedDrawer] || []).filter((item) => item.id !== itemId),
            }));

            toast.success('Item deleted successfully');
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    const openEditItem = (item) => {
        setCurrentItem(item);
        setItemForm({
            item_name: item.item_name,
            quantity: item.quantity.toString(),
            expiry_date: item.expiry_date,
        });
        setIsEditItemOpen(true);
    };

    const filteredItems = (items[selectedDrawer] || []).filter((item) => item.item_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const getStatusClass = (status) => {
        switch (status) {
            case 'warning':
                return 'border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400 [a&]:hover:bg-amber-600/10 [a&]:hover:text-amber-600/90 dark:[a&]:hover:bg-amber-400/10 dark:[a&]:hover:text-amber-400/90';
            case 'good':
                return 'border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 [a&]:hover:bg-green-600/10 [a&]:hover:text-green-600/90 dark:[a&]:hover:bg-green-400/10 dark:[a&]:hover:text-green-400/90';
            case 'expired':
            case 'short':
                return 'text-red-500 [a&]:hover:bg-destructive/10 [a&]:hover:text-destructive/90 border-destructive';
            default:
                return '';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'warning':
                return <AlertCircle className="h-4 w-4" />;
            case 'expired':
                return <AlertCircle className="h-4 w-4" />;
            case 'good':
                return <CheckCircle className="h-4 w-4" />;
            case 'short':
                return <CircleX className="h-4 w-4" />;
            default:
                return <Package className="h-4 w-4" />;
        }
    };

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteCart = () => {
        if (deleteId === null) return;
        setIsDeleting(true);

        if (role === 'admin') {
            router.delete(`/admin/carts/${deleteId}`, {
                onSuccess: () => {
                    setIsDeleting(false);
                    toast.success('Cart deleted successfully');
                },
                onError: () => {
                    setIsDeleting(false);
                    toast.error('Failed to delete cart');
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Cart Details" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-6">
                {/* Mobile-first header */}
                <div className="sticky top-0 z-10 border-b rounded-md border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl dark:text-gray-100">
                                {cart.cart_type} - {cart.cart_number} Details
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => window.history.back()}>
                                <ChevronLeft /> <span className="hidden md:block">Back</span>
                            </Button>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                                        <X color="red" /> <span className="hidden md:block">Cancel</span>
                                    </Button>
                                    <Button variant="outline" onClick={handleSubmit} disabled={processing}>
                                        <CircleCheckBig /> <span className="hidden md:block">{processing ? 'Updating...' : 'Update'}</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="outline" onClick={() => setIsEditing(true)}>
                                    <Pencil /> <span className="hidden md:block">Edit</span>
                                </Button>
                            )}
                            {role === 'admin' && (
                                <Button variant="destructive" onClick={() => setDeleteId(cart.id)}>
                                    <Trash2 /> <span className="hidden md:block">Delete</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Cart Information Card - Mobile Optimized */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 md:gap-6">
                                <div>
                                    <h3 className="mb-2 text-sm font-medium tracking-wide text-gray-500 dark:text-gray-200 uppercase">Cart Information</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-xs text-gray-500 dark:text-gray-200">Cart Number</span>
                                            {isEditing ? (
                                                <div>
                                                    <Input
                                                        value={data.cart_number}
                                                        onChange={(e) => setData('cart_number', e.target.value)}
                                                        className="flex-1"
                                                    />
                                                    {errors.cart_number && <p className="mt-1 text-sm text-red-500">{errors.cart_number}</p>}
                                                </div>
                                            ) : (
                                                <p className="font-medium">{cart.cart_number}</p>
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 dark:text-gray-200">Type</span>
                                            {isEditing ? (
                                                <div>
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
                                            ) : (
                                                <p className="font-medium">{cart.cart_type}</p>
                                            )}
                                        </div>
                                        {/* Location */}
                                        <div>
                                            <h3 className="mb-2 text-sm font-medium tracking-wide text-gray-500 dark:text-gray-200 uppercase">Location</h3>
                                            <div className="flex items-center gap-2">
                                                <Map className="h-4 w-4 text-gray-400" />
                                                {isEditing ? (
                                                    <div>
                                                        <Autocomplete
                                                            options={locationsOptions}
                                                            value={data.location_id?.toString() || ''}
                                                            onValueChange={(value) => setData('location_id', value)}
                                                            onCreateOption={handleCreateNewLocation}
                                                            placeholder="Select Location"
                                                            searchPlaceholder="Search location..."
                                                        />
                                                        {errors.location_id && <p className="mt-1 text-sm text-red-500">{errors.location_id}</p>}
                                                    </div>
                                                ) : (
                                                    <span className="flex-1">{cart.location_details.location_name}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-2 text-sm font-medium tracking-wide text-gray-500 dark:text-gray-200 uppercase">Status</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            {data.medi_lock ? (
                                                <Lock className="h-4 w-4" color="Green" />
                                            ) : (
                                                <Unlock className="h-4 w-4" color="Red" />
                                            )}
                                            <span className="text-sm">Medi Lock: </span>
                                        </div>
                                        <div>
                                            {isEditing ? (
                                                <div>
                                                    <Input
                                                        value={data.medi_lock}
                                                        onChange={(e) => setData('medi_lock', e.target.value)}
                                                        className="flex-1"
                                                    />
                                                    {errors.medi_lock && <p className="mt-1 text-sm text-red-500">{errors.medi_lock}</p>}
                                                </div>
                                            ) : (
                                                cart.supply_lock && (
                                                    <Badge variant="outline" className="bg-green-200 dark:text-gray-700 p-1.5 w-auto font-medium">
                                                        {cart.medi_lock}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {data.supply_lock ? (
                                                <Lock className="h-4 w-4" color="Green" />
                                            ) : (
                                                <Unlock className="h-4 w-4" color="Red" />
                                            )}
                                            <span className="text-sm">Supply Lock: </span>
                                        </div>
                                        <div>
                                            {isEditing ? (
                                                <div>
                                                    <Input
                                                        value={data.supply_lock}
                                                        onChange={(e) => setData('supply_lock', e.target.value)}
                                                        className="flex-1"
                                                    />
                                                    {errors.supply_lock && <p className="mt-1 text-sm text-red-500">{errors.supply_lock}</p>}
                                                </div>
                                            ) : (
                                                cart.supply_lock && (
                                                    <Badge variant="outline" className="bg-green-200 dark:text-gray-700 p-1.5 w-auto font-medium">
                                                        {cart.supply_lock}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-2 text-sm font-medium tracking-wide text-gray-500 dark:text-gray-200 uppercase">Additional Information</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-xs text-gray-500 dark:text-gray-200">Last Checked</span>
                                            <p className="font-medium">
                                                {cart.last_checked_date ? dayjs(cart.last_checked_date).format('MMM DD, YYYY') : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 dark:text-gray-200">Total Items</span>
                                            <p className="font-medium">{Object.values(items).flat().length}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code - Mobile Optimized */}
                                <div>
                                    <h3 className="mb-2 text-sm font-medium tracking-wide text-gray-500 dark:text-gray-200 uppercase">QR Code</h3>
                                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                                        <QRCodeSVG size={60} value={cart.qr_code} className="flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium">Scan to access</p>
                                            <p className="font-mono text-xs break-all text-gray-500 dark:text-gray-200">{cart.qr_code}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Drawer Tabs - Mobile Optimized */}
                    <Card>
                        <CardContent className="p-4">
                            <Tabs value={selectedDrawer} onValueChange={setSelectedDrawer} className="w-full space-y-2">
                                <TabsList className="flex h-auto w-full flex-wrap bg-gray-300 dark:bg-gray-700">
                                    {cartDrawers.map((drawer) => (
                                        <TabsTrigger
                                            key={drawer}
                                            value={drawer}
                                            className="flex items-center gap-2 px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                        >
                                            {drawer}
                                            {items[drawer] && items[drawer].length > 0 && (
                                                <Badge variant="default" className="ml-2 h-5 w-5 p-0 text-xs">
                                                    {items[drawer].length}
                                                </Badge>
                                            )}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {cartDrawers.map((drawer) => (
                                    <TabsContent key={drawer} value={drawer} className="space-y-2 p-2">
                                        {/* Search and Add Button */}
                                        <div className="flex flex-col gap-2 sm:flex-row">
                                            <div className="relative flex-1">
                                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                                <Input
                                                    placeholder="Search items..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                            <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="default" className="w-full sm:w-auto">
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Item
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>Add New Item to {drawer}</DialogTitle>
                                                        <DialogDescription>
                                                            Add a new item to this drawer with quantity and expiry information.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="name">Item Name</Label>
                                                            <Input
                                                                id="name"
                                                                value={itemForm.item_name}
                                                                onChange={(e) =>
                                                                    setItemForm((prev) => ({
                                                                        ...prev,
                                                                        item_name: e.target.value,
                                                                    }))
                                                                }
                                                                placeholder="Enter item name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <Label htmlFor="quantity">Quantity</Label>
                                                            <Input
                                                                id="quantity"
                                                                type="number"
                                                                value={itemForm.quantity}
                                                                onChange={(e) =>
                                                                    setItemForm((prev) => ({
                                                                        ...prev,
                                                                        quantity: e.target.value,
                                                                    }))
                                                                }
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="expiry_date">Expiry Date</Label>
                                                            <Input
                                                                id="expiry_date"
                                                                type="date"
                                                                value={itemForm.expiry_date}
                                                                onChange={(e) =>
                                                                    setItemForm((prev) => ({
                                                                        ...prev,
                                                                        expiry_date: e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button onClick={handleAddItem}>Add Item</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>

                                        {/* Items List */}
                                        <div className="space-y-2">
                                            {filteredItems.length === 0 ? (
                                                <div className="py-8 text-center text-gray-500 dark:text-gray-200">
                                                    <Package className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                                    <p>No items in this drawer</p>
                                                    <p className="text-sm">Add your first item to get started</p>
                                                </div>
                                            ) : (
                                                filteredItems.map((item) => (
                                                    <Card key={item.id} className="p-4">
                                                        <div className="grid grid-cols-1 gap-2 md:grid-cols-4 md:items-center">
                                                            {/* Left content */}
                                                            <div>
                                                                <div className="mb-1 flex items-center gap-2">
                                                                    <h4 className="truncate font-medium">{item.item_name}</h4>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={getStatusClass(item.status) + ' flex items-center gap-1'}
                                                                    >
                                                                        {getStatusIcon(item.status)}
                                                                        {item.status}
                                                                    </Badge>
                                                                </div>
                                                                <div>
                                                                    Qty: <span className="font-medium">{item.quantity}</span>
                                                                </div>
                                                            </div>

                                                            {/* Expiry info */}
                                                            <div>
                                                                Expires:{' '}
                                                                <span className="font-medium">{dayjs(item.expiry_date).format('MMM DD, YYYY')}</span>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={
                                                                        (dayjs(item.expiry_date).diff(dayjs(), 'day') > 0
                                                                            ? getStatusClass('good')
                                                                            : getStatusClass('expired')) + ' ml-2 text-xs font-normal'
                                                                    }
                                                                >
                                                                    {dayjs(item.expiry_date).diff(dayjs(), 'day')} days left
                                                                </Badge>
                                                            </div>

                                                            <div>
                                                                Last Checked:{' '}
                                                                <span className="font-medium">{dayjs(item.update_at).format('MMM DD, YYYY')}</span>
                                                            </div>

                                                            {/* Action buttons */}
                                                            <div className="flex justify-end gap-1">
                                                                <Button variant="ghost" size="sm" onClick={() => openEditItem(item)}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                                                                    <Trash2 className="h-4 w-4" color="Red" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </CardContent>
                    </Card>
                    {/* Edit Item Dialog */}
                    <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit Item</DialogTitle>
                                <DialogDescription>Update item details here.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-name">Item Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={itemForm.item_name}
                                        onChange={(e) =>
                                            setItemForm((prev) => ({
                                                ...prev,
                                                item_name: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter item name"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="edit-quantity">Quantity</Label>
                                    <Input
                                        id="edit-quantity"
                                        type="number"
                                        value={itemForm.quantity}
                                        onChange={(e) =>
                                            setItemForm((prev) => ({
                                                ...prev,
                                                quantity: e.target.value,
                                            }))
                                        }
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-expiry-date">Expiry Date</Label>
                                    <Input
                                        id="edit-expiry-date"
                                        type="date"
                                        value={itemForm.expiry_date?.slice(0, 10) || ''}
                                        onChange={(e) =>
                                            setItemForm((prev) => ({
                                                ...prev,
                                                expiry_date: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditItemOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleEditItem}>Update Item</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            {role === 'admin' && (
                <ConfirmDialog
                    open={deleteId !== null}
                    title="Delete Cart"
                    description="Are you sure you want to delete this cart? This action cannot be undone and will permanently remove all associated data."
                    onCancel={() => setDeleteId(null)}
                    onConfirm={deleteCart}
                    isLoading={isDeleting}
                    confirmText="Delete Cart"
                />
            )}
        </AppLayout>
    );
};
export default CartDetails;
