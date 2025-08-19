import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Map, Calendar, Lock, Unlock, Edit, QrCode, Clock } from 'lucide-react';
import { Cart, CartType, Drawer } from '../../types';
import DrawerAccordion from './DrawerAccordion';
import { useCart } from '../../context/CartContext';
import { QRCodeSVG } from 'qrcode.react';

interface CartDetailProps {
  cart: Cart;
  cartType: CartType;
}

const CartDetail: React.FC<CartDetailProps> = ({ cart, cartType }) => {
  const { updateLockStatus } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [editedLocation, setEditedLocation] = useState(cart.location);
  
  const handleToggleLock = (lockType: 'mediLock' | 'supplyLock') => {
    updateLockStatus(cart.id, lockType, !cart[lockType]);
  };
  
  const handleSaveLocation = () => {
    // In a real app, we would update the location in the API
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Cart Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Cart Number:</span>
                <p className="font-medium">{cart.cartNumber}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Type:</span>
                <p className="font-medium">{cartType.name}</p>
              </div>
              <div className="flex items-start">
                <Map size={18} className="text-gray-400 mt-0.5 mr-2" />
                {isEditing ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                      className="border border-gray-300 rounded-md p-1 text-sm"
                    />
                    <button 
                      onClick={handleSaveLocation}
                      className="ml-2 text-xs bg-primary-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-medium">{cart.location}</span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <Edit size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Lock Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <button
                  onClick={() => handleToggleLock('mediLock')}
                  className={`mr-3 p-2 rounded-full ${
                    cart.mediLock 
                      ? 'bg-success-100 text-success-600' 
                      : 'bg-warning-100 text-warning-600'
                  }`}
                >
                  {cart.mediLock ? <Lock size={18} /> : <Unlock size={18} />}
                </button>
                <div>
                  <p className="font-medium">Medi Lock</p>
                  <p className="text-xs text-gray-500">
                    {cart.mediLock ? 'Locked' : 'Unlocked'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <button
                  onClick={() => handleToggleLock('supplyLock')}
                  className={`mr-3 p-2 rounded-full ${
                    cart.supplyLock 
                      ? 'bg-success-100 text-success-600' 
                      : 'bg-warning-100 text-warning-600'
                  }`}
                >
                  {cart.supplyLock ? <Lock size={18} /> : <Unlock size={18} />}
                </button>
                <div>
                  <p className="font-medium">Supply Lock</p>
                  <p className="text-xs text-gray-500">
                    {cart.supplyLock ? 'Locked' : 'Unlocked'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Additional Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Last Checked:</p>
                  <p className="font-medium">
                    {format(parseISO(cart.lastChecked), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
                            
              <div className="flex items-center">
                <Clock size={18} className="text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Total Items:</p>
                  <p className="font-medium">
                    {cart.drawers.reduce(
                      (sum, drawer) => sum + drawer.equipment.length, 
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-200">
                <QRCodeSVG size={64} value={cart.qrCode} className="flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">QR Code</p>
                  <p className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1 break-all">
                    {cart.qrCode}
                  </p>
                </div>
              </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Drawers</h3>
        <div className="space-y-4">
          {cart.drawers.map((drawer: Drawer) => (
            <DrawerAccordion key={drawer.id} drawer={drawer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartDetail;