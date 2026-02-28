import { useForm } from '@inertiajs/react';

interface ChecklistFormProps {
    delivery: any;
    checklist?: any;
}

export default function ChecklistForm({ delivery, checklist }: ChecklistFormProps) {
    const { data, setData, post, processing } = useForm({
        vehicle_clean: checklist?.vehicle_clean ?? false,
        hvac_running: checklist?.hvac_running ?? false,
        logger_active: checklist?.logger_active ?? false,
        separation_verified: checklist?.separation_verified ?? false,
        containers_sealed: checklist?.containers_sealed ?? false,
        logs_completed: checklist?.logs_completed ?? false,
        chain_of_custody_signed: checklist?.chain_of_custody_signed ?? false,
    });

    const isAllChecked = Object.values(data).every(val => val === true);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('driver.checklist.store', delivery.id), {
            preserveScroll: true,
        });
    };

    const checkboxFields = [
        { id: 'vehicle_clean', label: 'Vehicle clean and cargo area ready' },
        { id: 'hvac_running', label: 'HVAC set to ~72°F and running continuously' },
        { id: 'logger_active', label: 'Temperature & humidity logger active' },
        { id: 'separation_verified', label: 'Clean vs soiled separation verified' },
        { id: 'containers_sealed', label: 'Containers sealed and intact' },
        { id: 'logs_completed', label: 'Logs completed' },
        { id: 'chain_of_custody_signed', label: 'Chain-of-custody signed' },
    ];

    if (checklist && isAllChecked) {
        return (
            <div className="mt-4 rounded-md bg-green-50 p-4 border border-green-200 dark:bg-green-900/40 dark:border-green-800">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                            All items complete ✓
                        </h3>
                        <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                            Checklist was last updated on {new Date(checklist.updated_at).toLocaleString()}.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Pre-Trip Checklist</h3>
            <form onSubmit={submit} className="space-y-3">
                {checkboxFields.map((field) => (
                    <div key={field.id} className="relative flex items-start">
                        <div className="flex h-6 items-center">
                            <input
                                id={field.id}
                                name={field.id}
                                type="checkbox"
                                checked={data[field.id as keyof typeof data]}
                                onChange={(e) => setData(field.id as keyof typeof data, e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-700"
                            />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                            <label htmlFor={field.id} className="font-medium text-gray-700 dark:text-gray-300">
                                {field.label}
                            </label>
                        </div>
                    </div>
                ))}

                <div className="pt-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex w-full sm:w-auto justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
                    >
                        Save Checklist
                    </button>
                    {checklist && (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Last saved: {new Date(checklist.updated_at).toLocaleString()}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
