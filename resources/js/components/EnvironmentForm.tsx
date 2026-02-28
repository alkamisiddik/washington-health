import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface EnvironmentLogFormProps {
    delivery: any;
    envLog?: any;
    readOnly?: boolean;
}

export default function EnvironmentForm({ delivery, envLog, readOnly = false }: EnvironmentLogFormProps) {
    const TEMP_MIN = 68;
    const TEMP_MAX = 76;
    const HUM_MIN = 30;
    const HUM_MAX = 60;

    const { data, setData, post, patch, processing, errors } = useForm({
        start_temp: envLog?.start_temp ?? '',
        start_humidity: envLog?.start_humidity ?? '',
        mid_temp: envLog?.mid_temp ?? '',
        mid_humidity: envLog?.mid_humidity ?? '',
        end_temp: envLog?.end_temp ?? '',
        end_humidity: envLog?.end_humidity ?? '',
        corrective_action: envLog?.corrective_action ?? '',
    });

    const [showExcursionOnSave, setShowExcursionOnSave] = useState(false);

    const checkRange = (temp: number | string, humidity: number | string) => {
        if (!temp && !humidity) return true; // not logged yet
        
        const tempVal = temp ? parseFloat(temp.toString()) : null;
        const humVal = humidity ? parseFloat(humidity.toString()) : null;

        if (tempVal !== null && (tempVal < TEMP_MIN || tempVal > TEMP_MAX)) return false;
        if (humVal !== null && (humVal < HUM_MIN || humVal > HUM_MAX)) return false;

        return true;
    };

    const statusObj = {
        start: checkRange(data.start_temp, data.start_humidity),
        mid: checkRange(data.mid_temp, data.mid_humidity),
        end: checkRange(data.end_temp, data.end_humidity),
    };

    const hasExcursion = !statusObj.start || !statusObj.mid || !statusObj.end;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowExcursionOnSave(true);
        if (hasExcursion && !data.corrective_action?.toString().trim()) {
            return;
        }
        if (envLog) {
            patch(route('driver.envlog.update', delivery.id), { preserveScroll: true, preserveState: true });
        } else {
            post(route('driver.envlog.store', delivery.id), { preserveScroll: true, preserveState: true });
        }
    };

    const renderTempHumRow = (label: string, prefix: 'start' | 'mid' | 'end') => {
        const isOk = statusObj[prefix];
        const tempVal = data[`${prefix}_temp` as keyof typeof data];
        const humVal = data[`${prefix}_humidity` as keyof typeof data];
        const isFilled = tempVal !== '' || humVal !== '';

        return (
            <div key={prefix} className="grid grid-cols-12 gap-2 items-center mb-3">
                <div className="col-span-12 sm:col-span-4">
                    <Label htmlFor={`${prefix}-temp`} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Label>
                </div>
                <div className="col-span-5 sm:col-span-3">
                    <div className="relative">
                        <Input
                            id={`${prefix}-temp`}
                            type="number"
                            step="0.01"
                            placeholder={`Temp (${TEMP_MIN}-${TEMP_MAX})`}
                            value={tempVal}
                            onChange={(e) => setData(`${prefix}_temp` as keyof typeof data, e.target.value)}
                            readOnly={readOnly}
                            className="pr-8"
                            autoComplete="off"
                        />
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">°F</span>
                    </div>
                </div>
                <div className="col-span-5 sm:col-span-3">
                    <div className="relative">
                        <Input
                            id={`${prefix}-hum`}
                            type="number"
                            step="0.01"
                            placeholder={`Hum (${HUM_MIN}-${HUM_MAX})`}
                            value={humVal}
                            onChange={(e) => setData(`${prefix}_humidity` as keyof typeof data, e.target.value)}
                            readOnly={readOnly}
                            className="pr-8"
                            autoComplete="off"
                        />
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
                    </div>
                </div>
                <div className="col-span-2 sm:col-span-2 flex justify-center">
                    {isFilled ? (isOk ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />) : <span className="text-xs text-muted-foreground">-</span>}
                </div>
            </div>
        );
    };

    return (
        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Temperature & Humidity Log</h3>
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-900/20">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                    Required range: Temperature {TEMP_MIN}°F – {TEMP_MAX}°F · Humidity {HUM_MIN}% – {HUM_MAX}% RH
                </p>
                <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-300">
                    Log at start, mid-route, and end of shift. Out-of-range readings require corrective action.
                </p>
            </div>
            
            <form onSubmit={submit} className="space-y-4">
                {renderTempHumRow('Start of Shift', 'start')}
                {renderTempHumRow('Mid-Route', 'mid')}
                {renderTempHumRow('End of Shift', 'end')}

                {showExcursionOnSave && hasExcursion && (
                    <div className="rounded-md bg-orange-50 p-4 border border-orange-200 dark:bg-orange-900/30 dark:border-orange-800">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-orange-400 dark:text-orange-500" aria-hidden="true" />
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300">Out of Range Reading Detected</h3>
                                <div className="mt-2 text-sm text-orange-700">
                                    <label htmlFor="corrective_action" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                                        Corrective Action Taken <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            id="corrective_action"
                                            name="corrective_action"
                                            rows={2}
                                            required={showExcursionOnSave && hasExcursion}
                                            value={data.corrective_action}
                                            onChange={e => setData('corrective_action', e.target.value)}
                                            readOnly={readOnly}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 disabled:opacity-50"
                                            placeholder="What steps were taken to resolve this?"
                                        />
                                        {errors.corrective_action && <p className="mt-1 text-sm text-red-600">{errors.corrective_action}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!readOnly && (
                    <div className="pt-3 flex items-center justify-between">
                        <Button
                            type="submit"
                            disabled={processing}
                            variant="outline"
                        >
                            Save Log
                        </Button>
                        {envLog && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Last saved: {new Date(envLog.updated_at).toLocaleString()}
                            </span>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}
