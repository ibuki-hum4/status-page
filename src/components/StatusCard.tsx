import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Settings } from 'lucide-react';
import { ZabbixService } from '../types/zabbix';

interface StatusCardProps {
  service: ZabbixService;
}

const StatusCard: React.FC<StatusCardProps> = ({ service }) => {
  const getStatusIcon = () => {
    switch (service.status) {
      case 'online':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'offline':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'maintenance':
        return <Settings className="w-6 h-6 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (service.status) {
      case 'online':
        return 'border-green-200 bg-green-50';
      case 'offline':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'maintenance':
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getStatusText = () => {
    switch (service.status) {
      case 'online':
        return 'Operational';
      case 'offline':
        return 'Down';
      case 'warning':
        return 'Degraded';
      case 'maintenance':
        return 'Maintenance';
    }
  };

  return (
    <div className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${getStatusColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon()}
            <h3 className="text-xl font-semibold text-gray-900 truncate">
              {service.name}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">{service.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Status:</span>
              <p className="font-medium text-gray-900">{getStatusText()}</p>
            </div>
            <div>
              <span className="text-gray-500">Uptime:</span>
              <p className="font-medium text-gray-900">{service.uptime}</p>
            </div>
            {service.responseTime && (
              <div>
                <span className="text-gray-500">Response Time:</span>
                <p className="font-medium text-gray-900">{service.responseTime}ms</p>
              </div>
            )}
            <div>
              <span className="text-gray-500">Last Check:</span>
              <p className="font-medium text-gray-900">
                {new Date(service.lastCheck).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;