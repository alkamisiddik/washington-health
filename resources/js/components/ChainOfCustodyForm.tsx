import { useForm, router } from '@inertiajs/react';
import SignaturePad from './SignaturePad';
import { CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { showAlert } from '@/utils/alerts';

interface ChainOfCustody {
    id?: number;
    container_ids: string;
    condition: string;
    pickup_department: string;
    delivery_department: string;
    pickup_time: string;
    delivery_time: string;
    driver_signature: string;
    driver_signed_at: string;
    receiver_signature: string;
    receiver_signed_at: string;
    exceptions: string;
}

interface ChainOfCustodyFormProps {
    delivery: { id: number; [key: string]: any };
    coc?: ChainOfCustody;
    readOnly?: boolean;
}

export default function ChainOfCustodyForm({ delivery, coc, readOnly = false }: ChainOfCustodyFormProps) {
    const { data, setData, processing } = useForm({
        container_ids: coc?.container_ids ?? '',
        condition: coc?.condition ?? '',
        pickup_department: coc?.pickup_department ?? '',
        delivery_department: coc?.delivery_department ?? '',
        pickup_time: coc?.pickup_time ? new Date(coc.pickup_time).toISOString().slice(0, 16) : '',
        delivery_time: coc?.delivery_time ? new Date(coc.delivery_time).toISOString().slice(0, 16) : '',
        driver_signature: coc?.driver_signature ?? '',
        driver_signed_at: coc?.driver_signed_at ?? '',
        receiver_signature: coc?.receiver_signature ?? '',
        receiver_signed_at: coc?.receiver_signed_at ?? '',
        exceptions: coc?.exceptions ?? '',
        is_final: false as boolean
    });

    const isComplete = coc && coc.driver_signature && coc.receiver_signature;

    const buildPayload = (overrides: Partial<typeof data> = {}) => ({
        container_ids: data.container_ids,
        condition: data.condition,
        pickup_department: data.pickup_department,
        delivery_department: data.delivery_department,
        pickup_time: data.pickup_time || null,
        delivery_time: data.delivery_time || null,
        driver_signature: data.driver_signature,
        driver_signed_at: data.driver_signed_at || null,
        receiver_signature: data.receiver_signature,
        receiver_signed_at: data.receiver_signed_at || null,
        exceptions: data.exceptions,
        is_final: false,
        ...overrides,
    });

    const submit = (e: React.FormEvent, isFinal = false) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const payload = buildPayload({ is_final: isFinal });
        const options = { 
            preserveScroll: true, 
            preserveState: false,
            onSuccess: () => {
                if (isFinal) showAlert('Success', 'Chain of custody marked complete!', 'success');
                else showAlert('Saved', 'Chain of custody data saved', 'success');
            }
        };

        if (coc) {
            router.patch(route('coc.update', delivery.id), payload, options);
        } else {
            router.post(route('coc.store', delivery.id), payload, options);
        }
    };

    const saveSignatureToServer = (overrides: Partial<typeof data>) => {
        const payload = buildPayload(overrides);
        router.post(route('coc.store', delivery.id), payload, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => showAlert('Saved', 'Signature and time saved', 'success'),
        });
    };

    let effectiveReadOnly = readOnly;
    if (isComplete && !readOnly) {
         effectiveReadOnly = true;
    }

    return (
        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center justify-between">
                <span>Chain of Custody</span>
                {isComplete && (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/40 dark:text-green-300">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Complete
                    </span>
                )}
            </h3>

            {isComplete && (
                 <div className="mb-4 rounded-md bg-green-50 p-3 border border-green-200 dark:bg-green-900/40 dark:border-green-800 flex items-center gap-3">
                     <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                     <div>
                         <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Chain of Custody Complete ✓</h4>
                         <p className="text-xs text-green-700 dark:text-green-300">All required signatures and data have been firmly logged.</p>
                     </div>
                 </div>
            )}
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Container IDs</Label>
                        <Input
                            value={data.container_ids}
                            onChange={e => setData('container_ids', e.target.value)}
                            readOnly={effectiveReadOnly}
                            placeholder="e.g. CTN-001, CTN-002"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Condition</Label>
                        <Select 
                            value={data.condition} 
                            onValueChange={v => setData('condition', v)}
                            disabled={effectiveReadOnly}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Intact">Intact</SelectItem>
                                <SelectItem value="Sealed">Sealed</SelectItem>
                                <SelectItem value="Damaged">Damaged</SelectItem>
                                <SelectItem value="Compromised">Compromised</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Pickup Department</Label>
                        <Input
                            value={data.pickup_department}
                            onChange={e => setData('pickup_department', e.target.value)}
                            readOnly={effectiveReadOnly}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Delivery Department</Label>
                        <Input
                            value={data.delivery_department}
                            onChange={e => setData('delivery_department', e.target.value)}
                            readOnly={effectiveReadOnly}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Pickup Time</Label>
                        <DateTimePicker
                            value={data.pickup_time}
                            onChange={e => setData('pickup_time', e)}
                            readOnly={effectiveReadOnly}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Delivery Time</Label>
                        <DateTimePicker
                            value={data.delivery_time}
                            onChange={e => setData('delivery_time', e)}
                            readOnly={effectiveReadOnly}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SignaturePad 
                        label="Driver Signature" 
                        existingSignature={data.driver_signature}
                        onSave={(val, signedAt) => {
                            setData('driver_signature', val);
                            setData('driver_signed_at', signedAt ?? '');
                            if (val && signedAt) {
                                const now = new Date().toISOString().slice(0, 16);
                                const pTime = data.pickup_time || now;
                                setData('pickup_time', pTime);
                                saveSignatureToServer({
                                    driver_signature: val,
                                    driver_signed_at: signedAt,
                                    pickup_time: pTime,
                                });
                            } else {
                                saveSignatureToServer({ driver_signature: '', driver_signed_at: '' });
                            }
                        }}
                        readOnly={effectiveReadOnly}
                    />
                    <SignaturePad 
                        label="Receiver Signature" 
                        existingSignature={data.receiver_signature}
                        onSave={(val, signedAt) => {
                            setData('receiver_signature', val);
                            setData('receiver_signed_at', signedAt ?? '');
                            if (val && signedAt) {
                                const now = new Date().toISOString().slice(0, 16);
                                const dTime = data.delivery_time || now;
                                setData('delivery_time', dTime);
                                saveSignatureToServer({
                                    receiver_signature: val,
                                    receiver_signed_at: signedAt,
                                    delivery_time: dTime,
                                });
                            } else {
                                saveSignatureToServer({ receiver_signature: '', receiver_signed_at: '' });
                            }
                        }}
                        readOnly={effectiveReadOnly}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Exceptions (Optional)</Label>
                    <Textarea
                        value={data.exceptions}
                        onChange={e => setData('exceptions', e.target.value)}
                        readOnly={effectiveReadOnly}
                        rows={2}
                    />
                </div>

                {(!isComplete && !effectiveReadOnly) && (
                    <div className="pt-3 space-y-2">
                        <p className="text-xs text-muted-foreground">
                            <strong>Save Progress</strong> saves your work. <strong>Mark Complete</strong> finalizes the chain of custody and requires both driver and receiver signatures above.
                        </p>
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={(e) => submit(e, false)}
                                disabled={processing}
                            >
                                Save Progress
                            </Button>
                            <Button
                                type="button"
                                onClick={(e) => submit(e, true)}
                                disabled={processing || !data.driver_signature || !data.receiver_signature}
                                title={(!data.driver_signature || !data.receiver_signature) ? 'Add both signatures above to enable' : ''}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                Mark Complete
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
