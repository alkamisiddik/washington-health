import { UserCard } from '@/components/custom/users/UserCard';
import { Pagination } from '@/components/custom/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/AdminLayout';
import { PaginatedData, User } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Plus, Shield, ShieldAlert, Truck, X } from 'lucide-react';
import { useState } from 'react';

export default function Index({ users }: { users: PaginatedData<User> }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { auth } = usePage().props as any;
    const [showAddForm, setShowAddForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'driver',
        password: '',
    });

    const handleRoleChange = (userId: number, newRole: string) => {
        router.patch(
            route('admin.users.role', userId),
            { role: newRole },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                reset();
                setShowAddForm(false);
            },
        });
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Manage Users" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">User Management</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage personnel, system access, and assign roles.</p>
                    </div>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className={`inline-flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:w-auto ${showAddForm ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                    >
                        {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {showAddForm ? 'Cancel' : 'Add New User'}
                    </Button>
                </div>

                {showAddForm && (
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Add System User</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleAddUser} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Default Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        minLength={8}
                                    />
                                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                                </div>

                                {/* Role */}
                                <div className="space-y-2">
                                    <Label>System Role</Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="driver">Driver (Default)</SelectItem>
                                            <SelectItem value="officer">Officer</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
                                </div>

                                {/* Submit */}
                                <div className="flex justify-end pt-2 md:col-span-2">
                                    <Button type="submit" disabled={processing}>
                                        Create User Profile
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Mobile: card list */}
                <div className="space-y-3 md:hidden">
                    {users.data.map((user: User) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            currentUserId={auth.user.id}
                            onRoleChange={handleRoleChange}
                        />
                    ))}
                </div>

                {/* Tablet/Desktop: table */}
                <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 md:block">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/50">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Assigned Deliveries</TableHead>
                                    <TableHead>Change Role</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {users.data.map((user: User) => (
                                    <TableRow key={user.id} className="transition-colors hover:bg-muted/50">
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{user.email}</TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={user.role === 'admin' ? 'destructive' : user.role === 'officer' ? 'secondary' : 'default'}
                                                className="flex w-fit items-center gap-1.5 px-2.5 py-1.5"
                                            >
                                                {user.role === 'admin' && <ShieldAlert className="h-3 w-3" />}
                                                {user.role === 'officer' && <Shield className="h-3 w-3" />}
                                                {user.role === 'driver' && <Truck className="h-3 w-3" />}
                                                {user.role.toUpperCase()}
                                            </Badge>
                                        </TableCell>

                                        {/* Delivery Count */}
                                        <TableCell className="text-muted-foreground">
                                            {user.role === 'driver'
                                                ? `${user.deliveries_as_driver_count || 0} Assigned`
                                                : user.role === 'officer'
                                                  ? `${user.deliveries_requested_count || 0} Requested`
                                                  : '-'}
                                        </TableCell>

                                        {/* Change Role */}
                                        <TableCell>
                                            {user.id !== auth.user.id ? (
                                                <Select defaultValue={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
                                                    <SelectTrigger className="w-[140px] bg-muted/80">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                        <SelectItem value="officer">Officer</SelectItem>
                                                        <SelectItem value="driver">Driver</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                                                    Active User
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination */}
                {users.links && users.links.length > 3 && <Pagination data={users} />}
            </div>
        </AdminLayout>
    );
}
