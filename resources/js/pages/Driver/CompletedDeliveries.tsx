import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DriverLayout from '@/layouts/DriverLayout';
import { Delivery, PaginatedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, ChevronLeft, Eye, History, MapPin } from 'lucide-react';

interface Props {
    deliveries: PaginatedData<Delivery>;
}

export default function CompletedDeliveries({ deliveries }: Props) {
    const list = deliveries.data || [];

    return (
        <DriverLayout
            breadcrumbs={[
                { title: 'My Deliveries', href: '/driver/deliveries' },
                { title: 'Completed History', href: '/driver/deliveries/completed' },
            ]}
        >
            <Head title="Completed Deliveries" />

            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Completed History</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Review your past deliveries and compliance records.</p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="gap-2">
                        <Link href={route('driver.deliveries')}>
                            <ChevronLeft className="h-4 w-4" />
                            Back to Active
                        </Link>
                    </Button>
                </div>

                <Card className="overflow-hidden pt-0 shadow-sm dark:border-gray-700">
                    <CardHeader className="border-b bg-indigo-100 py-4 dark:bg-indigo-900/50">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <History className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            PAST DELIVERIES
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-indigo-50/50 hover:bg-indigo-50/50 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/20">
                                        <TableHead className="w-[80px]">ID</TableHead>
                                        <TableHead>Route / Destination</TableHead>
                                        <TableHead>Completed At</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {list.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-48 text-center">
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <CheckCircle2 className="mb-2 h-10 w-10 opacity-20" />
                                                    <p>No completed deliveries found.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        list.map((delivery) => (
                                            <TableRow
                                                key={delivery.id}
                                                className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                                            >
                                                <TableCell className="font-mono text-xs font-bold text-muted-foreground">#{delivery.id}</TableCell>
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
                                                        {delivery.end_time
                                                            ? new Date(delivery.end_time).toLocaleDateString('en-US', {
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                                  year: 'numeric',
                                                              })
                                                            : '—'}
                                                    </div>
                                                    <div className="text-[11px] text-muted-foreground">
                                                        {delivery.end_time
                                                            ? new Date(delivery.end_time).toLocaleTimeString('en-US', {
                                                                  hour: 'numeric',
                                                                  minute: '2-digit',
                                                              })
                                                            : ''}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {delivery.duration_minutes ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-emerald-100 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                        >
                                                            {delivery.duration_minutes} min
                                                        </Badge>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <Link href={route('driver.deliveries.show', delivery.id)}>
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
        </DriverLayout>
    );
}
