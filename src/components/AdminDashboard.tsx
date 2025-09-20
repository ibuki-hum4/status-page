import React, { useState } from 'react';
import { Plus, Settings, LogOut, Users, BarChart3 } from 'lucide-react';
import StatusCard from './StatusCard';
import ServiceForm from './ServiceForm';
import { ZabbixService } from '../types/zabbix';

interface AdminDashboardProps {
  services: ZabbixService[];
  onAddService: (service: Omit<ZabbixService, 'id'>) => void;
  onUpdateService: (id: string, updates: Partial<ZabbixService>) => void;
  onDeleteService: (id: string) => void;
  onLogout: () => void;
  onRefresh: () => void;
  loading: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
  onLogout,
  onRefresh,
  loading,
}) => {
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<ZabbixService | null>(null);
  const [activeTab, setActiveTab] = useState<'services' | 'settings'>('services');

  const handleEditService = (service: ZabbixService) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  const handleFormSubmit = (serviceData: Omit<ZabbixService, 'id'>) => {
    if (editingService) {
      onUpdateService(editingService.id, serviceData);
    } else {
      onAddService(serviceData);
    }
    setShowServiceForm(false);
    setEditingService(null);
  };

  const handleFormCancel = () => {
    setShowServiceForm(false);
    setEditingService(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={onRefresh}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Refresh Data
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('services')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Services ({services.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </div>
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'services' && (
          <>
            {/* Add Service Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowServiceForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>

            {/* Services Grid */}
            {services.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services configured</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first service</p>
                <button
                  onClick={() => setShowServiceForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Service
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                  <div key={service.id} className="relative">
                    <StatusCard service={service} />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onDeleteService(service.id)}
                        className="p-1 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Dashboard Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">API Configuration</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Zabbix API URL:</strong> https://zabbix.skyia.jp/zabbix/api_jsonrpc.php
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> <span className="text-green-600">Connected</span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Refresh Settings</h3>
                <p className="text-sm text-gray-600">
                  Services are automatically refreshed every 30 seconds to ensure up-to-date status information.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Service Form Modal */}
      {showServiceForm && (
        <ServiceForm
          service={editingService}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default AdminDashboard;