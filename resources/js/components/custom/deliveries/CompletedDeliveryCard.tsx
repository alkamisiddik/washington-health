import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Eye, MapPin } from 'lucide-react';
import type { Delivery } from '@/types';

interface CompletedDeliveryCardProps {
    delivery: Delivery;
}

export function CompletedDeliveryCard({ delivery }: CompletedDeliveryCardProps) {
    return (
        <Card className="shadow-sm transition-shadow last:mb-0 dark:border-gray-700 md:mb-0">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-muted-foreground">
                                #{delivery.id}
                            </span>
                            {delivery.duration_minutes != null && (
                                <Badge
                                    variant="outline"
                                    className="border-emerald-100 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                >
                                    {delivery.duration_minutes} min
                                </Badge>
                            )}
                        </div>

                        <div className="mt-2 flex items-start gap-2 text-sm">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                            <div className="min-w-0">
                                <div className="font-semibold text-gray-900 dark:text-gray-100">
                                    {delivery.delivery_location}
                                </div>
                                <div className="mt-0.5 text-[11px] uppercase tracking-tight text-muted-foreground">
                                    From: {delivery.pickup_location}
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                            {delivery.end_time ? (
                                <>
                                    <span className="font-medium">
                                        {new Date(delivery.end_time).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                    <span className="ml-1">
                                        {new Date(delivery.end_time).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </>
                            ) : (
                                '—'
                            )}
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-11 w-11 shrink-0 touch-manipulation text-indigo-600 hover:bg-indigo-50 hover:text-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300"
                    >
                        <Link href={route('driver.deliveries.show', delivery.id)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
