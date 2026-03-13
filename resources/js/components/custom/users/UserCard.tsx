import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { User } from '@/types';
import { Shield, ShieldAlert, Truck } from 'lucide-react';

interface UserCardProps {
    user: User;
    currentUserId: number;
    onRoleChange: (userId: number, newRole: string) => void;
}

export function UserCard({ user, currentUserId, onRoleChange }: UserCardProps) {
    const isCurrentUser = user.id === currentUserId;

    return (
        <Card className="shadow-sm transition-shadow last:mb-0 dark:border-gray-700 md:mb-0">
            <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                        <div className="mt-2">
                            <Badge
                                variant={user.role === 'admin' ? 'destructive' : user.role === 'officer' ? 'secondary' : 'default'}
                                className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1"
                            >
                                {user.role === 'admin' && <ShieldAlert className="h-3 w-3" />}
                                {user.role === 'officer' && <Shield className="h-3 w-3" />}
                                {user.role === 'driver' && <Truck className="h-3 w-3" />}
                                {user.role.toUpperCase()}
                            </Badge>
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                            {user.role === 'driver'
                                ? `${(user as User & { deliveries_as_driver_count?: number }).deliveries_as_driver_count ?? 0} Assigned`
                                : user.role === 'officer'
                                  ? `${(user as User & { deliveries_requested_count?: number }).deliveries_requested_count ?? 0} Requested`
                                  : '—'}
                        </p>
                    </div>
                    <div className="shrink-0 sm:w-[140px]">
                        {isCurrentUser ? (
                            <span className="block rounded-md border border-dashed px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Active User
                            </span>
                        ) : (
                            <Select
                                defaultValue={user.role}
                                onValueChange={(value) => onRoleChange(user.id, value)}
                            >
                                <SelectTrigger className="h-11 w-full touch-manipulation bg-muted/80">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="officer">Officer</SelectItem>
                                    <SelectItem value="driver">Driver</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
