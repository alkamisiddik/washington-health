import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ChevronDown, ChevronUp, Plus, Clock, Calendar, Edit, Trash2 } from 'lucide-react';
import { Drawer, Equipment } from '../../types';
import { useCart } from '../../context/CartContext';

interface DrawerAccordionProps {
  drawer: Drawer;
}

const DrawerAccordion: React.FC<DrawerAccordionProps> = ({ drawer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const { addEquipment, updateEquipment, deleteEquipment } = useCart();
  
  const [newEquipment, setNewEquipment] = useState<Omit<Equipment, 'id' | 'drawerId' | 'lastUpdated'>>({
    name: '',
    quantity: 1,
    expiryDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Default 30 days from now
  });
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
    // Reset forms when closing
    if (isOpen) {
      setShowAddForm(false);
      setEditingItemId(null);
    }
  };
  
  const handleAddClick = () => {
    setShowAddForm(!showAddForm);
    setEditingItemId(null);
  };
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEquipment(drawer.id, newEquipment);
    setNewEquipment({
      name: '',
      quantity: 1,
      expiryDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    });
    setShowAddForm(false);
  };
  
  const handleEditClick = (equipment: Equipment) => {
    setEditingItemId(equipment.id);
    setShowAddForm(false);
  };
  
  const handleEditSubmit = (equipment: Equipment) => {
    updateEquipment(equipment);
    setEditingItemId(null);
  };
  
  const handleDeleteClick = (equipmentId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteEquipment(equipmentId);
    }
  };
  
  // Sort equipment by expiry date (earliest first)
  const sortedEquipment = [...drawer.equipment].sort((a, b) => 
    new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );
  
  const getExpiryStatus = (expiryDate: string): { color: string, label: string } => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { color: 'text-warning-600', label: 'Expired' };
    if (diffDays <= 7) return { color: 'text-warning-600', label: `${diffDays} days left` };
    if (diffDays <= 30) return { color: 'text-orange-500', label: `${diffDays} days left` };
    return { color: 'text-success-500', label: `${diffDays} days left` };
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div 
        className={`px-4 py-3 bg-gray-50 flex justify-between items-center cursor-pointer transition-colors ${isOpen ? 'border-b border-gray-200' : ''}`}
        onClick={handleToggle}
      >
        <h4 className="font-medium text-gray-900">{drawer.name}</h4>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-3">
            {drawer.equipment.length} items
          </span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      
      {isOpen && (
        <div className="p-4 animate-fade-in">
          {drawer.equipment.length === 0 && !showAddForm ? (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-2">No equipment in this drawer</p>
              <button
                onClick={handleAddClick}
                className="inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                <Plus size={16} className="mr-1" />
                Add Equipment
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleAddClick}
                  className="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-600 rounded-md hover:bg-primary-100 transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Add Equipment
                </button>
              </div>
              
              {showAddForm && (
                <form onSubmit={handleAddSubmit} className="bg-gray-50 p-4 rounded-lg mb-4 animate-slide-in">
                  <h5 className="font-medium mb-3">Add New Equipment</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Name*</label>
                      <input
                        type="text"
                        value={newEquipment.name}
                        onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Quantity*</label>
                      <input
                        type="number"
                        min="1"
                        value={newEquipment.quantity}
                        onChange={(e) => setNewEquipment({ ...newEquipment, quantity: parseInt(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Expiry Date*</label>
                      <input
                        type="date"
                        value={newEquipment.expiryDate}
                        onChange={(e) => setNewEquipment({ ...newEquipment, expiryDate: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Add Equipment
                    </button>
                  </div>
                </form>
              )}
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expiry Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedEquipment.map((equipment) => (
                      <React.Fragment key={equipment.id}>
                        <tr className="hover:bg-gray-50">
                          {editingItemId === equipment.id ? (
                            <td colSpan={5} className="px-4 py-3">
                              <div className="bg-gray-50 p-3 rounded-lg animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Name</label>
                                    <input
                                      type="text"
                                      value={equipment.name}
                                      onChange={(e) => updateEquipment({...equipment, name: e.target.value})}
                                      className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={equipment.quantity}
                                      onChange={(e) => updateEquipment({...equipment, quantity: parseInt(e.target.value)})}
                                      className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Expiry Date</label>
                                    <input
                                      type="date"
                                      value={equipment.expiryDate}
                                      onChange={(e) => updateEquipment({...equipment, expiryDate: e.target.value})}
                                      className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => setEditingItemId(null)}
                                    className="px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded-md"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleEditSubmit(equipment)}
                                    className="px-2 py-1 text-xs bg-primary-600 text-white rounded-md"
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            </td>
                          ) : (
                            <>
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-900">{equipment.name}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm">{equipment.quantity}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <Calendar size={14} className="text-gray-400 mr-1.5" />
                                  <span className="text-sm">{format(parseISO(equipment.expiryDate), 'MMM dd, yyyy')}</span>
                                  <span className={`ml-2 text-xs ${getExpiryStatus(equipment.expiryDate).color}`}>
                                    ({getExpiryStatus(equipment.expiryDate).label})
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock size={14} className="text-gray-400 mr-1.5" />
                                  {format(parseISO(equipment.lastUpdated), 'MMM dd, yyyy')}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleEditClick(equipment)}
                                    className="text-gray-400 hover:text-primary-600"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(equipment.id)}
                                    className="text-gray-400 hover:text-warning-600"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DrawerAccordion;