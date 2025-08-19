import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { Camera, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
    onScanSuccess: (decodedText: string) => void;
}

const Scan: React.FC<Props> = ({ onScanSuccess }) => {
    const { auth } = usePage().props;
    const role = auth.user.role;

    const [searchTerm, setSearchTerm] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const { errors } = usePage().props;
    const scannerRef = useRef(null);

    useEffect(() => {
        if (!isScanning) return;

        const html5QrCode = new Html5Qrcode('qr-reader');
        scannerRef.current = html5QrCode;

        let isMounted = true;

        html5QrCode
            .start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: 250 },
                (decodedText) => {
                    if (!isMounted) return;
                    handleScan(decodedText);

                    // Safely stop only if running
                    if (html5QrCode.getState() === Html5QrcodeScannerState.SCANNING || html5QrCode.getState() === Html5QrcodeScannerState.PAUSED) {
                        html5QrCode.stop().then(() => {
                            html5QrCode.clear();
                            setIsScanning(false);
                        });
                    }
                },
                (errorMessage) => {
                    // ignore scan errors
                },
            )
            .catch((err) => {
                console.error('Failed to start QR scanner', err);
            });

        return () => {
            isMounted = false;
            if (html5QrCode.getState() === Html5QrcodeScannerState.SCANNING || html5QrCode.getState() === Html5QrcodeScannerState.PAUSED) {
                html5QrCode
                    .stop()
                    .then(() => html5QrCode.clear())
                    .catch((err) => {
                        console.error('Error stopping scanner during cleanup', err);
                    });
            }
        };
    }, [isScanning]);

    useEffect(() => {
        if (errors.term) {
            toast.error(errors.term);
        }
    }, [errors]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleScan(searchTerm);
    };

    const handleScan = (term: string) => {
        if (!term) {
            toast.error('Cart number is required.');
            return;
        }

        router.visit(route(role + '.carts.search'), {
            method: 'get',
            data: { term },
            preserveScroll: true,
            onError: (errors) => {
                toast.error(errors.term || 'Cart not found.');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Find cart" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Find Cart</h1>
                </div>
                <Card className="mx-auto max-w-2xl">
                    <div className="rounded-lg bg-white dark:bg-transparent p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-200">Search Cart</h2>
                            <Button
                                onClick={() => setIsScanning((prev) => !prev)}
                                className={`flex items-center rounded-md px-3 py-1.5 ${
                                    isScanning ? 'bg-orange-100 text-orange-500' : 'bg-blue-50 text-blue-500'
                                }`}
                            >
                                {isScanning ? (
                                    <>
                                        <X size={18} className="mr-1.5" />
                                        Stop Scanning
                                    </>
                                ) : (
                                    <>
                                        <Camera size={18} className="mr-1.5" />
                                        Scan QR Code
                                    </>
                                )}
                            </Button>
                        </div>

                        {isScanning ? (
                            <div className="mb-6">
                                <div id="qr-reader" className="w-full" />
                                <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-200">Position the QR code within the frame to scan</p>
                            </div>
                        ) : (
                            <>
                                <p className="mb-6 text-gray-600 dark:text-gray-200">Enter a cart number or QR code to find a specific cart</p>

                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div>
                                        <label htmlFor="search" className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Cart Number or QR Code
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="search"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Enter cart number or QR code"
                                                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Search className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <Button
                                            type="submit"
                                            className="me-2 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            <Search className="mr-2" />
                                            Search Cart
                                        </Button>
                                    </div>
                                </form>

                                <div className="mt-8 border-t pt-6">
                                    <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Quick Tips:</h3>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <li>• Cart numbers are usually in the format: XX123 (e.g., CR101)</li>
                                        <li>• Click "Scan QR Code" to use your device's camera</li>
                                        <li>• Make sure to enter the complete cart number or QR code</li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Scan;
