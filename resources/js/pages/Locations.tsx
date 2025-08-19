import HeadingSmall from '@/components/heading-small';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Check, Loader2, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface Location {
    id: number;
    location_name: string;
    status: string;
    is_default: boolean;
}

interface PageProps {
    locations?: Location[];

    [key: string]: unknown;
}

const Locations = ({ locations }: { locations: Location[] }) => {
    const [locationName, setLocationName] = useState<Location[]>(locations);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        location_name: '',
        status: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        post('/admin/locations', {
            onSuccess: (page: { props: PageProps }) => {
                if (page.props.locations) {
                    setLocationName(page.props.locations || []);
                }
                reset('location_name');
                toast.success('Location created successfully');
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const startEdit = (locationName: Location) => {
        setEditingId(locationName.id);
        setEditValue(locationName.location_name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    const saveEdit = (id: number) => {
        if (!editValue.trim()) {
            toast.error('Location name cannot be empty');
            return;
        }

        setIsUpdating(true);

        router.put(
            `/admin/locations/${id}`,
            {
                location_name: editValue,
            },
            {
                onSuccess: (page: { props: PageProps }) => {
                    if (page.props.location) {
                        setLocationName((prev) =>
                            prev.map((loc) =>
                                loc.id === id
                                    ? {
                                          ...loc,
                                          location_name: page.props.location.location_name,
                                      }
                                    : loc,
                            ),
                        );
                    } else {
                        // Update local state if server doesn't return updated data
                        setLocationName((prev) =>
                            prev.map((title) =>
                                title.id === id
                                    ? {
                                          ...title,
                                          location_name: editValue,
                                      }
                                    : title,
                            ),
                        );
                    }
                    setEditingId(null);
                    setEditValue('');
                    toast.success('Location updated successfully');
                    setIsUpdating(false);
                },
                onError: () => {
                    setIsUpdating(false);
                },
            },
        );
    };

    const deleteLocation = () => {
        if (deleteId === null) return;

        setIsDeleting(true);

        router.delete(`/admin/locations/${deleteId}`, {
            onSuccess: (page: { props: PageProps }) => {
                if (page.props.locations) {
                    setLocationName(page.props.locations || []);
                } else {
                    // Update local state if server doesn't return updated data
                    setLocationName((prev) => prev.filter((title) => title.id !== deleteId));
                }
                setDeleteId(null);
                toast.success('Location deleted successfully');
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    const setDefault = async (id: number) => {
        try {
            router.put(`/admin/locations/setDefault/${id}`);
            toast.success('Default location updated');
            // Reload or mutate your locations list
        } catch (error) {
            toast.error('Failed to set default');
        }
    };

    const toggleStatus = (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

        router.put(`/admin/locations/${id}`, { status: newStatus }, {
            onSuccess: (page: { props: PageProps }) => {
                if (page.props.location) {
                    setLocationName(prev =>
                        prev.map(loc =>
                            loc.id === id ? { ...loc, status: page.props.location.status } : loc
                        )
                    );
                } else {
                    setLocationName(prev =>
                        prev.map(loc =>
                            loc.id === id ? { ...loc, status: newStatus } : loc
                        )
                    );
                }

                toast.success(`Status updated to ${newStatus}`);
            },
            onError: () => {
                toast.error('Failed to update status');
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Location List" />
            <SettingsLayout>
                <HeadingSmall title="Location settings" description="Update your location settings" />
                <div className="mb-3 rounded-lg border bg-card p-3 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Add New Location</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="title">Location Name</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={data.location_name}
                                    onChange={(e) => setData('location_name', e.target.value)}
                                    placeholder="Enter Location Name"
                                    className="flex-1"
                                />
                                <Button type="submit" disabled={processing || isSubmitting || !data.location_name.trim()}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting
                                        </>
                                    ) : (
                                        'Add'
                                    )}
                                </Button>
                            </div>
                            {errors.location_name && <p className="mt-1 text-sm text-destructive">{errors.location_name}</p>}
                        </div>
                    </form>
                </div>
                <div className="rounded-lg border bg-card p-3 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Location List</h2>
                    <div className="rounded-md border">
                        <Table className="w-full rounded-md border border-gray-200 shadow-sm dark:border-gray-700">
                            <TableHeader>
                                <TableRow className="bg-gray-100 text-gray-700 dark:bg-violet-950 dark:text-gray-100">
                                    <TableHead className="w-[60px] px-4 py-2 text-left text-sm font-medium">ID</TableHead>
                                    <TableHead className="px-4 py-2 text-left text-sm font-medium">Location Name</TableHead>
                                    <TableHead className="px-4 py-2 text-left text-sm font-medium">Default</TableHead>
                                    <TableHead className="px-4 py-2 text-left text-sm font-medium">Status</TableHead>
                                    <TableHead className="w-[180px] px-4 py-2 text-center text-sm font-medium">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {locations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                                            No location found. Add one above.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    locations.map((location) => (
                                        <TableRow key={location.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                            <TableCell className="px-4 py-2 text-sm">{location.id}</TableCell>
                                            <TableCell className="px-4 py-2 text-sm">
                                                {editingId === location.id ? (
                                                    <Input
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(location.id)}
                                                        className="max-w-sm text-sm"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span>{location.location_name}</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-sm">
                                                {location.is_default ? (
                                                    <Badge variant="" className="cursor-pointer">Default</Badge>
                                                ) : (
                                                    <Button
                                                        size="xs"
                                                        variant="outline"
                                                        onClick={() => setDefault(location.id)}
                                                        className="px-2 py-1 text-xs cursor-pointer"
                                                    >
                                                        Set Default
                                                    </Button>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                <Badge
                                                    onClick={() => toggleStatus(location.id, location.status)}
                                                    variant="outline"
                                                    className={`px-2 py-1 text-xs font-medium cursor-pointer ${
                                                        location.status === 'Active'
                                                            ? 'border-green-600 text-green-600'
                                                            : 'border-red-600 text-red-600'
                                                    } `}
                                                >
                                                    {location.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                {editingId === location.id ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() => saveEdit(location.id)}
                                                            disabled={isUpdating}
                                                        >
                                                            {isUpdating ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Check className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <Button size="icon" variant="outline" onClick={cancelEdit} disabled={isUpdating}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button size="icon" variant="outline" onClick={() => startEdit(location)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon" variant="outline" onClick={() => setDeleteId(location.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                {/* Delete confirmation dialog */}
                <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone. This will permanently delete the location.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={deleteLocation}
                                disabled={isDeleting}
                                className="bg-red-700 text-gray-100 hover:bg-destructive/90"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SettingsLayout>
        </AppLayout>
    );
};

export default Locations;
