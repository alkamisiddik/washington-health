import AdminLayout from '@/layouts/AdminLayout';
import { Head, router, usePage, Link, useForm } from '@inertiajs/react';
import { Shield, ShieldAlert, Truck, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface UsersProps {
    users: any;
}

export default function Index({ users }: UsersProps) {
    const { auth } = usePage().props as any;
    const [showAddForm, setShowAddForm] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'driver',
        password: '',
    });

    const handleRoleChange = (userId: number, newRole: string) => {
        router.patch(route('admin.users.role', userId), { role: newRole }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                reset();
                setShowAddForm(false);
            }
        });
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Users', href: '/admin/users' }]}>
            <Head title="Manage Users" />
            <div className="p-4 lg:p-6 flex-1 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">User Management</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage personnel, system access, and assign roles.</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {showAddForm ? 'Cancel' : 'Add New User'}
                    </button>
                </div>

                {showAddForm && (
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Add System User</h2>
                        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white sm:text-sm" />
                                {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white sm:text-sm" />
                                {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Password</label>
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} required minLength={8} className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white sm:text-sm" />
                                {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">System Role</label>
                                <select value={data.role} onChange={e => setData('role', e.target.value)} className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white sm:text-sm">
                                    <option value="driver">Driver (Default)</option>
                                    <option value="officer">Officer</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && <span className="text-xs text-red-500">{errors.role}</span>}
                            </div>
                            <div className="md:col-span-2 pt-2 flex justify-end">
                                <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
                                    Create User Profile
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b dark:bg-gray-800/50 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Email</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Role</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Assigned Deliveries</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Change Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {users.data.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold
                                                ${user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 
                                                  user.role === 'officer' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 
                                                  'bg-green-100 text-green-700 dark:bg-green-900/30'}
                                            `}>
                                                {user.role === 'admin' && <ShieldAlert className="h-3 w-3" />}
                                                {user.role === 'officer' && <Shield className="h-3 w-3" />}
                                                {user.role === 'driver' && <Truck className="h-3 w-3" />}
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {user.role === 'driver' ? `${user.deliveries_as_driver_count || 0} Assigned` :
                                             user.role === 'officer' ? `${user.deliveries_requested_count || 0} Requested` : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.id !== auth.user.id ? (
                                                <select
                                                    defaultValue={user.role}
                                                    onChange={e => handleRoleChange(user.id, e.target.value)}
                                                    className="block w-full max-w-xs rounded border-gray-300 py-1 pl-3 pr-8 text-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="officer">Officer</option>
                                                    <option value="driver">Driver</option>
                                                </select>
                                            ) : (
                                                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">Active User</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:bg-gray-800 dark:border-gray-700 gap-4">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing <span className="font-medium">{users.from || 0}</span> to <span className="font-medium">{users.to || 0}</span> of{' '}
                                    <span className="font-medium">{users.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    {users.links.map((link: any, idx: number) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                link.active
                                                    ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-700'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''} ${
                                                idx === 0 ? 'rounded-l-md' : idx === users.links.length - 1 ? 'rounded-r-md' : ''
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
