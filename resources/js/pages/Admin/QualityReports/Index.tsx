import { ActionConfirmDialog } from '@/components/ActionConfirmDialog';
import { Pagination } from '@/components/custom/Pagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/AdminLayout';
import { PaginatedData, QualityReport } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ClipboardCheck, Eye, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    reports: PaginatedData<QualityReport>;
    filters: { month_year: string; supervisor: string };
}

export default function Index({ reports, filters }: Props) {
    const [monthYear, setMonthYear] = useState(filters.month_year || '');
    const [supervisor, setSupervisor] = useState(filters.supervisor || '');
    const [viewReport, setViewReport] = useState<QualityReport | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const applyFilters = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.quality-reports.index'), { month_year: monthYear || undefined, supervisor: supervisor || undefined }, { preserveState: true });
    };

    const resetFilters = () => {
        setMonthYear('');
        setSupervisor('');
        router.get(route('admin.quality-reports.index'), {}, { preserveState: false });
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Quality Reports', href: '/admin/quality-reports' }]}>
            <Head title="Quality Reports" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Delivery Quality Review</h1>
                        <p className="text-sm text-muted-foreground">Monthly supervisor reviews and quality reports.</p>
                    </div>
                </div>

                <div className="rounded-lg border bg-muted/30 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/50">
                    <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-2">
                        <div className="w-36">
                            <Label className="text-[10px] font-medium text-muted-foreground">Month / Year</Label>
                            <Input
                                type="month"
                                value={monthYear}
                                onChange={(e) => setMonthYear(e.target.value)}
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="w-40">
                            <Label className="text-[10px] font-medium text-muted-foreground">Supervisor</Label>
                            <Input
                                type="text"
                                value={supervisor}
                                onChange={(e) => setSupervisor(e.target.value)}
                                placeholder="Name"
                                className="h-8 text-xs"
                            />
                        </div>
                        <Button type="submit" size="sm" className="h-8 gap-1 px-3 text-xs">
                            <Search className="h-3.5 w-3.5" />
                            Search
                        </Button>
                        <Button type="button" size="sm" variant="outline" className="h-8 px-3 text-xs" onClick={resetFilters}>
                            Reset
                        </Button>
                    </form>
                </div>

                <div className="overflow-hidden rounded-xl border bg-white text-xs shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/50">
                                <TableHead className="h-9 px-3 py-2 font-medium">Month / Year</TableHead>
                                <TableHead className="h-9 px-3 py-2 font-medium">Supervisor</TableHead>
                                <TableHead className="h-9 px-3 py-2 font-medium">Vehicle</TableHead>
                                <TableHead className="h-9 px-3 py-2 font-medium">Delivery ID</TableHead>
                                <TableHead className="h-9 max-w-[140px] px-3 py-2 font-medium">Issues found</TableHead>
                                <TableHead className="h-9 max-w-[140px] px-3 py-2 font-medium">Actions taken</TableHead>
                                <TableHead className="h-9 px-3 py-2 text-right font-medium">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-20 px-3 py-2 text-center text-muted-foreground">
                                        No quality reports found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reports.data.map((report) => (
                                    <TableRow key={report.id} className="hover:bg-muted/50">
                                        <TableCell className="px-3 py-2 font-medium">{report.month_year}</TableCell>
                                        <TableCell className="max-w-[120px] truncate px-3 py-2">{report.supervisor_name || '—'}</TableCell>
                                        <TableCell className="px-3 py-2">{report.vehicle?.vehicle_number ?? report.vehicle_ids ?? '—'}</TableCell>
                                        <TableCell className="px-3 py-2">
                                            {report.delivery_id ? (
                                                <Link href={route('admin.deliveries.show', report.delivery_id)} className="text-indigo-600 hover:underline">
                                                    #{report.delivery_id}
                                                </Link>
                                            ) : (
                                                '—'
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-[140px] truncate px-3 py-2 text-muted-foreground" title={report.environmental_excursions || ''}>
                                            {report.environmental_excursions || '—'}
                                        </TableCell>
                                        <TableCell className="max-w-[140px] truncate px-3 py-2 text-muted-foreground" title={report.corrective_actions || ''}>
                                            {report.corrective_actions || '—'}
                                        </TableCell>
                                        <TableCell className="px-3 py-2 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600"
                                                    onClick={() => setViewReport(report)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sr-only">View</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700"
                                                    onClick={() => setDeleteId(report.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {reports.links && reports.links.length > 3 && <Pagination data={reports} />}
            </div>

            <Dialog open={!!viewReport} onOpenChange={(open) => !open && setViewReport(null)}>
                <DialogContent className="max-h-[85vh] overflow-y-auto">
                    {viewReport && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <ClipboardCheck className="h-4 w-4" />
                                    Quality Report — {viewReport.month_year}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Supervisor:</span> {viewReport.supervisor_name || '—'}</p>
                                <p><span className="font-medium">Vehicle(s):</span> {viewReport.vehicle_ids || viewReport.vehicle?.vehicle_number || '—'}</p>
                                <p><span className="font-medium">Delivery:</span> {viewReport.delivery_id ? `#${viewReport.delivery_id}` : '—'}</p>
                                <p><span className="font-medium">Transport days reviewed:</span> {viewReport.transport_days_reviewed || '—'}</p>
                                <p><span className="font-medium">Environmental excursions:</span> {viewReport.environmental_excursions || '—'}</p>
                                <p><span className="font-medium">Corrective actions:</span> {viewReport.corrective_actions || '—'}</p>
                                <p><span className="font-medium">Training issues:</span> {viewReport.training_issues || '—'}</p>
                                <p><span className="font-medium">Preventive improvements:</span> {viewReport.preventive_improvements || '—'}</p>
                                <p><span className="font-medium">Signature / Date:</span> {viewReport.signature_date || '—'}</p>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <ActionConfirmDialog
                open={deleteId !== null}
                onCancel={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        router.delete(route('admin.quality-reports.destroy', deleteId), { onSuccess: () => setDeleteId(null) });
                    }
                }}
                title="Delete this report?"
                description="This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </AdminLayout>
    );
}
