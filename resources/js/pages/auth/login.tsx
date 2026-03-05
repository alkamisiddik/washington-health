import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, ShieldCheck, Truck, UserCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const quickLogin = (email: string) => {
        setData((prev) => ({ ...prev, email, password: '12345678' }));
    };

    return (
        <AuthLayout title="Safe Transit Portal" description="Secure access for Washington Health logistics personnel">
            <Head title="Log in" />

            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="grid gap-5">
                    <div className="grid gap-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="name@washingtonhealth.com"
                            className="bg-gray-50/50 focus:bg-white dark:bg-gray-900/50"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                Secure Password
                            </Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="text-xs text-indigo-600 hover:text-indigo-700" tabIndex={5}>
                                    Recovery access?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className="bg-gray-50/50 focus:bg-white dark:bg-gray-900/50"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', checked === true)}
                                tabIndex={3}
                            />
                            <Label htmlFor="remember" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Keep me logged in
                            </Label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 h-11 w-full bg-indigo-600 text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 dark:shadow-none"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                        Authenticate Account
                    </Button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200 dark:border-gray-800"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-gray-400 dark:bg-zinc-950">Development Access</span>
                        </div>
                    </div>

                    {/* Quick Access Panel */}
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => quickLogin('admin@gmail.com')}
                            className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-indigo-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/40"
                        >
                            <ShieldCheck className="mb-1.5 h-5 w-5 text-red-500 transition-transform group-hover:scale-110" />
                            <span className="text-[10px] font-bold tracking-tighter text-gray-700 uppercase dark:text-gray-300">Admin</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => quickLogin('officer@gmail.com')}
                            className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-indigo-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/40"
                        >
                            <UserCircle className="mb-1.5 h-5 w-5 text-indigo-500 transition-transform group-hover:scale-110" />
                            <span className="text-[10px] font-bold tracking-tighter text-gray-700 uppercase dark:text-gray-300">Officer</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => quickLogin('driver@gmail.com')}
                            className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-indigo-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/40"
                        >
                            <Truck className="mb-1.5 h-5 w-5 text-amber-500 transition-transform group-hover:scale-110" />
                            <span className="text-[10px] font-bold tracking-tighter text-gray-700 uppercase dark:text-gray-300">Driver</span>
                        </button>
                    </div>

                    <div className="mt-2 text-center text-xs text-muted-foreground">
                        Need organizational access?{' '}
                        <TextLink href={route('register')} className="font-bold text-indigo-600 hover:underline" tabIndex={5}>
                            Contact Admin
                        </TextLink>
                    </div>
                </div>
            </form>
            {status && <div className="mt-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
