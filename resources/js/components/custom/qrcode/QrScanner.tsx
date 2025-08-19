import React, { useState } from 'react';
import { QrReader } from 'react-qr-scanner';
import { QrCode, Eye, EyeOff } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const QrScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getCartByQrCode } = useCart();
  const navigate = useNavigate();
  
  const handleScan = (data: any) => {
    if (data) {
      console.log('Scanned data:', data);
      const qrCode = data.text;
      
      // Find cart by QR code
      const cart = getCartByQrCode(qrCode);
      
      if (cart) {
        // Navigate to cart detail page
        navigate(`/carts/${cart.id}`);
        setScanning(false);
      } else {
        setError('Cart not found for this QR code. Please try again.');
        setTimeout(() => setError(null), 3000);
      }
    }
  };
  
  const handleError = (err: any) => {
    console.error('QR scan error:', err);
    setError('Error scanning QR code. Please try again.');
    setTimeout(() => setError(null), 3000);
  };
  
  const toggleScanner = () => {
    setScanning(!scanning);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">QR Code Scanner</h2>
        <p className="text-gray-600">
          Scan a cart's QR code to quickly access its details and update equipment
        </p>
      </div>
      
      {error && (
        <div className="w-full max-w-lg bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded mb-4 animate-fade-in">
          {error}
        </div>
      )}
      
      <div className="w-full max-w-lg bg-white rounded-lg overflow-hidden shadow-md">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <div className="flex items-center">
            <QrCode size={20} className="text-gray-500 mr-2" />
            <span className="font-medium">Scanner</span>
          </div>
          <button
            onClick={toggleScanner}
            className={`flex items-center px-3 py-1.5 rounded-md ${
              scanning 
                ? 'bg-warning-50 text-warning-600' 
                : 'bg-primary-50 text-primary-600'
            }`}
          >
            {scanning ? (
              <>
                <EyeOff size={16} className="mr-1.5" />
                <span>Stop Scanning</span>
              </>
            ) : (
              <>
                <Eye size={16} className="mr-1.5" />
                <span>Start Scanning</span>
              </>
            )}
          </button>
        </div>
        
        <div className="p-6">
          {scanning ? (
            <div className="rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
              />
              
              <div className="bg-black bg-opacity-50 text-white text-center py-2">
                Position QR code in the center
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <QrCode size={48} className="text-gray-400 mb-3" />
              <p className="text-gray-500 text-center">
                Press "Start Scanning" to activate the camera
              </p>
              <button
                onClick={toggleScanner}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md"
              >
                Start Scanning
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center w-full max-w-lg">
        <h3 className="text-lg font-medium mb-2">Testing Instructions</h3>
        <p className="text-gray-600 mb-4">
          For testing purposes, you can manually enter a cart's QR code:
        </p>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Enter QR Code"
            className="p-2 border border-gray-300 rounded-l-md w-64"
          />
          <button className="bg-primary-600 text-white px-4 py-2 rounded-r-md">
            Look Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrScanner;