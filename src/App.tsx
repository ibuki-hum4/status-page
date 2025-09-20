import React, { useState } from 'react';
import { useZabbixAPI } from './hooks/useZabbixAPI';
import StatusPage from './components/StatusPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentView, setCurrentView] = useState<'status' | 'admin' | 'dashboard'>('status');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const {
    isAuthenticated,
    services,
    loading,
    error,
    authenticate,
    authenticateWithToken,
    logout,
    fetchServices,
    addService,
    updateService,
    deleteService,
  } = useZabbixAPI();

  const handleLogin = async (username: string, password: string) => {
    const success = await authenticate(username, password);
    if (success) {
      setCurrentView('dashboard');
    }
    return success;
  };

  const handleTokenLogin = (token: string) => {
    const success = authenticateWithToken(token);
    if (success) {
      setCurrentView('dashboard');
    }
    return success;
  };

  const handleLogout = () => {
    logout();
    setCurrentView('status');
  };

  const handleRefresh = () => {
    fetchServices();
    setLastUpdate(new Date());
  };

  // Navigation component
  const Navigation = () => (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentView('status')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              currentView === 'status'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Status Page
          </button>
          {!isAuthenticated ? (
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === 'admin'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Admin
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Navigation - only show on status page and when not authenticated */}
      {(currentView === 'status' || !isAuthenticated) && <Navigation />}
      
      {/* Main Content */}
      {currentView === 'status' && (
        <StatusPage
          services={services}
          loading={loading}
          onRefresh={handleRefresh}
          lastUpdate={lastUpdate}
        />
      )}
      
      {currentView === 'admin' && !isAuthenticated && (
        <AdminLogin
          onLogin={handleLogin}
          onTokenLogin={handleTokenLogin}
          loading={loading}
          error={error}
        />
      )}
      
      {currentView === 'dashboard' && isAuthenticated && (
        <AdminDashboard
          services={services}
          onAddService={addService}
          onUpdateService={updateService}
          onDeleteService={deleteService}
          onLogout={handleLogout}
          onRefresh={handleRefresh}
          loading={loading}
        />
      )}
    </div>
  );
}

export default App;