import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Map, Lock, Unlock, Search } from 'lucide-react';
import { Cart } from '../../types';
import { useCart } from '../../context/CartContext';
import { QRCodeSVG } from 'qrcode.react';

interface CartListProps {
  carts: Cart[];
}

const CartList: React.FC<CartListProps> = ({ carts }) => {
  const { cartTypes } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Get unique locations for filtering
  const locations = Array.from(new Set(carts.map(cart => cart.location))).sort();
  
  // Filter carts based on search and filters
  const filteredCarts = carts.filter(cart => {
    const matchesSearch = 
      cart.cartNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter ? cart.location === locationFilter : true;
    const matchesType = typeFilter ? cart.cartTypeId === typeFilter : true;
    
    return matchesSearch && matchesLocation && matchesType;
  });
  
  const getCartTypeName = (cartTypeId: string): string => {
    const cartType = cartTypes.find(type => type.id === cartTypeId);
    return cartType ? cartType.name : 'Unknown';
  };

  if (carts.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 mb-4">No carts found</p>
        <Link to="/carts/new" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
          Add Your First Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search carts..."
            className="pl-10 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex gap-4">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Types</option>
            {cartTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QR
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cart Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Locks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Checked
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCarts.map((cart) => (
              <tr key={cart.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <QRCodeSVG size={40} value={cart.qrCode} className="flex-shrink-0" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{cart.cartNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{getCartTypeName(cart.cartTypeId)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Map size={16} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">{cart.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cart.mediLock ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
                    }`}>
                      {cart.mediLock ? <Lock size={12} className="mr-1" /> : <Unlock size={12} className="mr-1" />}
                      Medi
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cart.supplyLock ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
                    }`}>
                      {cart.supplyLock ? <Lock size={12} className="mr-1" /> : <Unlock size={12} className="mr-1" />}
                      Supply
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(parseISO(cart.lastChecked), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link 
                    to={`/carts/${cart.id}`}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredCarts.length === 0 && (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No carts match your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default CartList;