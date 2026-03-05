import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import OfficerLayout from '@/layouts/OfficerLayout';
import { Delivery, PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, MapPin, Package, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Index({ deliveries, filters }: { deliveries: PaginatedData<Delivery>; filters: { status: string } }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const handleFilterChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        router.get(route('officer.deliveries.index'), { status: newStatus }, { preserveState: true });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge
                        variant="outline"
                        className="border-yellow-200 bg-yellow-100 text-[10px] font-bold text-yellow-800 uppercase dark:bg-yellow-900/40 dark:text-yellow-300"
                    >
                        PENDING
                    </Badge>
                );
            case 'assigned':
                return (
                    <Badge
                        variant="outline"
                        className="border-blue-200 bg-blue-100 text-[10px] font-bold text-blue-800 uppercase dark:bg-blue-900/40 dark:text-blue-300"
                    >
                        ASSIGNED
                    </Badge>
                );
            case 'in_progress':
                return (
                    <Badge
                        variant="outline"
                        className="border-purple-200 bg-purple-100 text-[10px] font-bold text-purple-800 uppercase dark:bg-purple-900/40 dark:text-purple-300"
                    >
                        IN PROGRESS
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-100 text-[10px] font-bold text-emerald-800 uppercase dark:bg-emerald-900/40 dark:text-emerald-300"
                    >
                        COMPLETED
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-[10px] font-bold uppercase">
                        {status.replace('_', ' ')}
                    </Badge>
                );
        }
    };

    return (
        <OfficerLayout breadcrumbs={[{ title: 'Deliveries', href: '/officer/deliveries' }]}>
            <Head title="Deliveries" />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Deliveries Management</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track and manage all your shipment requests.</p>
                    </div>
                    <Button asChild className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Link href={route('officer.deliveries.create')}>
                            <Plus className="h-4 w-4" />
                            New Delivery
                        </Link>
                    </Button>
                </div>

                <div className="scrollbar-none flex flex-wrap gap-2 overflow-x-auto pb-2">
                    {['all', 'pending', 'assigned', 'in_progress', 'completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleFilterChange(status)}
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                                statusFilter === status
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'border bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                        >
                            {status === 'all' ? 'All Deliveries' : status.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>

                <Card className="overflow-hidden pt-0 shadow-sm dark:border-gray-700">
                    <CardHeader className="border-b bg-indigo-100 py-4 dark:bg-indigo-900/50">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <Package className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            DELIVERY LOG
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-indigo-50/50 hover:bg-indigo-50/50 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/20">
                                        <TableHead className="w-[80px]">ID</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Driver</TableHead>
                                        <TableHead>Route Details</TableHead>
                                        <TableHead>Scheduled</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {deliveries.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-48 text-center">
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <Package className="mb-2 h-10 w-10 opacity-20" />
                                                    <p>No deliveries found matching the current filter.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        deliveries.data.map((delivery: Delivery) => (
                                            <TableRow
                                                key={delivery.id}
                                                className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                                            >
                                                <TableCell className="font-mono text-xs font-bold text-muted-foreground">#{delivery.id}</TableCell>
                                                <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                                                <TableCell>
                                                    {delivery.driver ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600 uppercase dark:bg-indigo-900/30">
                                                                {delivery.driver.name.charAt(0)}
                                                            </div>
                                                            <span className="text-sm font-medium">{delivery.driver.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">Unassigned</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                            <MapPin className="h-3 w-3 text-indigo-500" />
                                                            {delivery.delivery_location}
                                                        </div>
                                                        <div className="mt-0.5 pl-5 text-[11px] tracking-tight text-muted-foreground uppercase">
                                                            From: {delivery.pickup_location}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm font-medium">
                                                        {new Date(delivery.scheduled_time).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </div>
                                                    <div className="text-[11px] text-muted-foreground">
                                                        {new Date(delivery.scheduled_time).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <Link href={route('officer.deliveries.show', delivery.id)}>
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">View</span>
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {deliveries.links && deliveries.links.length > 3 && (
                    <div className="flex justify-center gap-2 pt-4">
                        {deliveries.links.map((link, idx) => (
                            <Button
                                key={idx}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                asChild
                                disabled={!link.url}
                                className={!link.url ? 'pointer-events-none opacity-50' : ''}
                            >
                                <Link href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </OfficerLayout>
    );
}
