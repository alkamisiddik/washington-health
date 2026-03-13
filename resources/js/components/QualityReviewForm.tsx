import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

export interface QualityReviewFormData {
    month_year: string;
    vehicle_ids: string;
    transport_days_reviewed: string;
    environmental_excursions: string;
    corrective_actions: string;
    training_issues: string;
    preventive_improvements: string;
    supervisor_name: string;
    signature_date: string;
    delivery_id: string;
    vehicle_id: string;
}

const defaultData: QualityReviewFormData = {
    month_year: '',
    vehicle_ids: '',
    transport_days_reviewed: '',
    environmental_excursions: '',
    corrective_actions: '',
    training_issues: '',
    preventive_improvements: '',
    supervisor_name: '',
    signature_date: '',
    delivery_id: '',
    vehicle_id: '',
};

interface QualityReviewFormProps {
    submitRoute: string;
    initialDeliveryId?: number | null;
    initialVehicleId?: number | null;
    onSuccess?: () => void;
}

export function QualityReviewForm({ submitRoute, initialDeliveryId, initialVehicleId, onSuccess }: QualityReviewFormProps) {
    const { data, setData, post, processing, errors } = useForm<QualityReviewFormData>({
        ...defaultData,
        month_year: new Date().toISOString().slice(0, 7),
        delivery_id: initialDeliveryId ? String(initialDeliveryId) : '',
        vehicle_id: initialVehicleId ? String(initialVehicleId) : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(submitRoute, {
            preserveScroll: true,
            onSuccess: () => onSuccess?.(),
        });
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="border-b py-3">
                <CardTitle className="text-base">Monthly Supervisor Review</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="month_year">Month / Year</Label>
                            <Input
                                id="month_year"
                                type="month"
                                value={data.month_year}
                                onChange={(e) => setData('month_year', e.target.value)}
                                className="h-9"
                            />
                            {errors.month_year && <p className="text-xs text-destructive">{errors.month_year}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vehicle_ids">Vehicle ID(s)</Label>
                            <Input
                                id="vehicle_ids"
                                value={data.vehicle_ids}
                                onChange={(e) => setData('vehicle_ids', e.target.value)}
                                placeholder="e.g. VH-001, VH-002"
                                className="h-9"
                            />
                            {errors.vehicle_ids && <p className="text-xs text-destructive">{errors.vehicle_ids}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="transport_days_reviewed">Transport Days Reviewed</Label>
                        <Input
                            id="transport_days_reviewed"
                            value={data.transport_days_reviewed}
                            onChange={(e) => setData('transport_days_reviewed', e.target.value)}
                            className="h-9"
                        />
                        {errors.transport_days_reviewed && <p className="text-xs text-destructive">{errors.transport_days_reviewed}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="environmental_excursions">Environmental Excursions</Label>
                        <Textarea
                            id="environmental_excursions"
                            value={data.environmental_excursions}
                            onChange={(e) => setData('environmental_excursions', e.target.value)}
                            rows={2}
                            className="resize-none text-sm"
                        />
                        {errors.environmental_excursions && <p className="text-xs text-destructive">{errors.environmental_excursions}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="corrective_actions">Corrective Actions</Label>
                        <Textarea
                            id="corrective_actions"
                            value={data.corrective_actions}
                            onChange={(e) => setData('corrective_actions', e.target.value)}
                            rows={2}
                            className="resize-none text-sm"
                        />
                        {errors.corrective_actions && <p className="text-xs text-destructive">{errors.corrective_actions}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="training_issues">Training Issues</Label>
                        <Textarea
                            id="training_issues"
                            value={data.training_issues}
                            onChange={(e) => setData('training_issues', e.target.value)}
                            rows={2}
                            className="resize-none text-sm"
                        />
                        {errors.training_issues && <p className="text-xs text-destructive">{errors.training_issues}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="preventive_improvements">Preventive Improvements</Label>
                        <Textarea
                            id="preventive_improvements"
                            value={data.preventive_improvements}
                            onChange={(e) => setData('preventive_improvements', e.target.value)}
                            rows={2}
                            className="resize-none text-sm"
                        />
                        {errors.preventive_improvements && <p className="text-xs text-destructive">{errors.preventive_improvements}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="supervisor_name">Supervisor Name</Label>
                            <Input
                                id="supervisor_name"
                                value={data.supervisor_name}
                                onChange={(e) => setData('supervisor_name', e.target.value)}
                                className="h-9"
                            />
                            {errors.supervisor_name && <p className="text-xs text-destructive">{errors.supervisor_name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="signature_date">Signature / Date</Label>
                            <Input
                                id="signature_date"
                                value={data.signature_date}
                                onChange={(e) => setData('signature_date', e.target.value)}
                                placeholder="Name, date"
                                className="h-9"
                            />
                            {errors.signature_date && <p className="text-xs text-destructive">{errors.signature_date}</p>}
                        </div>
                    </div>

                    {data.delivery_id && (
                        <div className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                            Linked to Delivery #{data.delivery_id}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 border-t pt-4">
                        <Button type="submit" disabled={processing} size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                            Save Report
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
