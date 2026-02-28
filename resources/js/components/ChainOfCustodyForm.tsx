import { useForm, router } from '@inertiajs/react';
import SignaturePad from './SignaturePad';
import { CheckCircle2 } from 'lucide-react';

interface ChainOfCustodyFormProps {
    delivery: any;
    coc?: any;
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
        e.preventDefault();
        const payload = buildPayload({ is_final: isFinal });
        if (coc) {
            router.patch(route('coc.update', delivery.id), payload, { preserveScroll: true, preserveState: true });
        } else {
            router.post(route('coc.store', delivery.id), payload, { preserveScroll: true, preserveState: true });
        }
    };

    const saveSignatureToServer = (overrides: Partial<typeof data>) => {
        const payload = buildPayload(overrides);
        if (coc) {
            router.patch(route('coc.update', delivery.id), payload, { preserveScroll: true, preserveState: true });
        } else {
            router.post(route('coc.store', delivery.id), payload, { preserveScroll: true, preserveState: true });
        }
    };

    if (isComplete && !readOnly) {
         readOnly = true; // Automatically lock fields if completed to avoid accidental overrides unless specifically handled
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Container IDs</label>
                        <input
                            type="text"
                            value={data.container_ids}
                            onChange={e => setData('container_ids', e.target.value)}
                            readOnly={readOnly}
                            placeholder="e.g. CTN-001, CTN-002"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Condition</label>
                        <select
                            value={data.condition}
                            onChange={e => setData('condition', e.target.value)}
                            disabled={readOnly}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:opacity-50"
                        >
                            <option value="">Select Condition</option>
                            <option value="Intact">Intact</option>
                            <option value="Sealed">Sealed</option>
                            <option value="Damaged">Damaged</option>
                            <option value="Compromised">Compromised</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pickup Department</label>
                        <input
                            type="text"
                            value={data.pickup_department}
                            onChange={e => setData('pickup_department', e.target.value)}
                            readOnly={readOnly}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Department</label>
                        <input
                            type="text"
                            value={data.delivery_department}
                            onChange={e => setData('delivery_department', e.target.value)}
                            readOnly={readOnly}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pickup Time</label>
                        <input
                            type="datetime-local"
                            value={data.pickup_time}
                            onChange={e => setData('pickup_time', e.target.value)}
                            readOnly={readOnly}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Time</label>
                        <input
                            type="datetime-local"
                            value={data.delivery_time}
                            onChange={e => setData('delivery_time', e.target.value)}
                            readOnly={readOnly}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:opacity-50"
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
                                if (!data.pickup_time) setData('pickup_time', now);
                                saveSignatureToServer({
                                    driver_signature: val,
                                    driver_signed_at: signedAt,
                                    pickup_time: data.pickup_time || now,
                                });
                            } else {
                                saveSignatureToServer({ driver_signature: '', driver_signed_at: null });
                            }
                        }}
                        readOnly={readOnly}
                    />
                    {data.driver_signed_at && (
                        <p className="text-xs text-muted-foreground col-span-2">Driver signed: {new Date(data.driver_signed_at).toLocaleString()}</p>
                    )}
                    <SignaturePad 
                        label="Receiver Signature" 
                        existingSignature={data.receiver_signature}
                        onSave={(val, signedAt) => {
                            setData('receiver_signature', val);
                            setData('receiver_signed_at', signedAt ?? '');
                            if (val && signedAt) {
                                const now = new Date().toISOString().slice(0, 16);
                                if (!data.delivery_time) setData('delivery_time', now);
                                saveSignatureToServer({
                                    receiver_signature: val,
                                    receiver_signed_at: signedAt,
                                    delivery_time: data.delivery_time || now,
                                });
                            } else {
                                saveSignatureToServer({ receiver_signature: '', receiver_signed_at: null });
                            }
                        }}
                        readOnly={readOnly}
                    />
                    {data.receiver_signed_at && (
                        <p className="text-xs text-muted-foreground col-span-2">Receiver signed: {new Date(data.receiver_signed_at).toLocaleString()}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exceptions (Optional)</label>
                    <textarea
                        value={data.exceptions}
                        onChange={e => setData('exceptions', e.target.value)}
                        readOnly={readOnly}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:opacity-50"
                    />
                </div>

                {(!isComplete && !readOnly) && (
                    <div className="pt-3 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                submit(e, false);
                            }}
                            disabled={processing}
                            className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                submit(e, true);
                            }}
                            disabled={processing || !data.driver_signature || !data.receiver_signature}
                            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                            Mark Complete
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
