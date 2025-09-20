import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import StatusCard from './StatusCard';
import { ZabbixService } from '../types/zabbix';

interface StatusPageProps {
  services: ZabbixService[];
  loading: boolean;
  onRefresh: () => void;
  lastUpdate: Date;
}

const StatusPage: React.FC<StatusPageProps> = ({ 
  services, 
  loading, 
  onRefresh, 
  lastUpdate 
}) => {
  const getOverallStatus = () => {
    if (services.length === 0) return 'unknown';
    
    const hasOffline = services.some(s => s.status === 'offline');
    const hasWarning = services.some(s => s.status === 'warning');
    const hasMaintenance = services.some(s => s.status === 'maintenance');
    
    if (hasOffline) return 'major';
    if (hasWarning) return 'minor';
    if (hasMaintenance) return 'maintenance';
    return 'operational';
  };

  const getStatusMessage = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'operational':
        return 'All Systems Operational';
      case 'minor':
        return 'Minor Service Disruption';
      case 'major':
        return 'Major Service Outage';
      case 'maintenance':
        return 'Scheduled Maintenance';
      default:
        return 'Status Unknown';
    }
  };

  const getStatusColor = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-100';
      case 'minor':
        return 'text-yellow-600 bg-yellow-100';
      case 'major':
        return 'text-red-600 bg-red-100';
      case 'maintenance':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Activity className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">System Status</h1>
          </div>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor()}`}>
            <div className="w-3 h-3 bg-current rounded-full opacity-75"></div>
            <span className="font-semibold">{getStatusMessage()}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleString()}
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Services Grid */}
        {loading && services.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services configured</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <StatusCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {/* Statistics */}
        {services.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {services.filter(s => s.status === 'online').length}
                </div>
                <div className="text-gray-600">Operational</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {services.filter(s => s.status === 'warning').length}
                </div>
                <div className="text-gray-600">Warning</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {services.filter(s => s.status === 'offline').length}
                </div>
                <div className="text-gray-600">Down</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {services.filter(s => s.status === 'maintenance').length}
                </div>
                <div className="text-gray-600">Maintenance</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPage;