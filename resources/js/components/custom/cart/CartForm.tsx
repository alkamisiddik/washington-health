import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { v4 as uuidv4 } from 'uuid';

interface CartFormProps {
  onSuccess: () => void;
}

const CartForm: React.FC<CartFormProps> = ({ onSuccess }) => {
  const { cartTypes, addCart } = useCart();
  
  const [formData, setFormData] = useState({
    cartTypeId: '',
    cartNumber: '',
    location: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cartTypeId) {
      newErrors.cartTypeId = 'Cart type is required';
    }
    
    if (!formData.cartNumber) {
      newErrors.cartNumber = 'Cart number is required';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Generate a unique QR code for the cart
    const qrCode = uuidv4();
    
    // Create new cart
    addCart({
      cartTypeId: formData.cartTypeId,
      cartNumber: formData.cartNumber,
      location: formData.location,
      qrCode,
      mediLock: false,
      supplyLock: false,
      lastChecked: new Date().toISOString().split('T')[0],
    });
    
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="cartTypeId" className="block text-sm font-medium text-gray-700 mb-1">
          Cart Type*
        </label>
        <select
          id="cartTypeId"
          name="cartTypeId"
          value={formData.cartTypeId}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${errors.cartTypeId ? 'border-warning-500' : 'border-gray-300'}`}
        >
          <option value="">Select a cart type</option>
          {cartTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.cartTypeId && (
          <p className="mt-1 text-sm text-warning-500">{errors.cartTypeId}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="cartNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Cart Number*
        </label>
        <input
          type="text"
          id="cartNumber"
          name="cartNumber"
          value={formData.cartNumber}
          onChange={handleChange}
          placeholder="e.g., CR101"
          className={`w-full p-2 border rounded-md ${errors.cartNumber ? 'border-warning-500' : 'border-gray-300'}`}
        />
        {errors.cartNumber && (
          <p className="mt-1 text-sm text-warning-500">{errors.cartNumber}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location*
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., ER, ICU, Surgery"
          className={`w-full p-2 border rounded-md ${errors.location ? 'border-warning-500' : 'border-gray-300'}`}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-warning-500">{errors.location}</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Create Cart
        </button>
      </div>
    </form>
  );
};

export default CartForm;