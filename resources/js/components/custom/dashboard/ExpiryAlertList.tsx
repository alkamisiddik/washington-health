import React from 'react';
import { ExpiryAlert } from '@/types';
import { Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExpiryAlertListProps {
  alerts: ExpiryAlert[];
}

const ExpiryAlertList: React.FC<ExpiryAlertListProps> = ({ alerts }) => {
  const getSeverityColor = (daysRemaining: number): string => {
    if (daysRemaining <= 7) return 'text-warning-600 bg-warning-50';
    if (daysRemaining <= 14) return 'text-orange-600 bg-orange-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No expiry alerts at this time.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {alerts.map((alert, index) => (
        <li key={index} className="py-3 animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
          <Link
            to={`/carts/${alert.cartId}`}
            className="flex items-start p-2 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div className={`p-2 rounded-full mr-3 ${getSeverityColor(alert.daysRemaining)}`}>
              {alert.daysRemaining <= 7 ? (
                <AlertTriangle size={18} />
              ) : (
                <Clock size={18} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {alert.equipmentName}
                </p>
                <span className="text-xs font-medium">
                  {alert.daysRemaining} {alert.daysRemaining === 1 ? 'day' : 'days'} left
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Cart: {alert.cartNumber} | Location: {alert.location}
              </p>
              <p className="text-xs text-gray-500">
                Expires: {alert.expiryDate}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ExpiryAlertList;
