import { useState, useEffect, useCallback } from 'react';
import ZabbixAPI from '../utils/zabbixAPI';
import { ZabbixService } from '../types/zabbix';

const API_URL = 'https://zabbix.skyia.jp/zabbix/api_jsonrpc.php';

export const useZabbixAPI = () => {
  const [api] = useState(() => new ZabbixAPI(API_URL));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [services, setServices] = useState<ZabbixService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to authenticate with token directly
  const authenticateWithToken = useCallback((token: string) => {
    setLoading(true);
    setError(null);
    
    try {
      api.setAuthToken(token);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError('Invalid token');
      return false;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const authenticate = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.authenticate(username, password);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const logout = useCallback(() => {
    api.logout();
    setIsAuthenticated(false);
    setServices([]);
  }, [api]);

  const fetchServices = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const hosts = await api.getHosts();
      const triggers = await api.getTriggers();
      
      // Convert Zabbix data to our service format
      const servicesData: ZabbixService[] = Array.isArray(hosts) ? hosts.map((host: any) => {
        // Find triggers for this host
        const hostTriggers = Array.isArray(triggers) ? 
          triggers.filter((trigger: any) => 
            host.triggers?.some((ht: any) => ht.triggerid === trigger.triggerid)
          ) : [];
        
        // Determine status based on triggers and host status
        let status: ZabbixService['status'] = 'online';
        if (host.status === '1') {
          status = 'maintenance';
        } else if (hostTriggers.some((trigger: any) => trigger.value === '1' && trigger.priority >= '4')) {
          status = 'offline';
        } else if (hostTriggers.some((trigger: any) => trigger.value === '1')) {
          status = 'warning';
        }
        
        return {
          id: host.hostid,
          name: host.name || host.host,
          description: `Host: ${host.host}`,
          status,
          lastCheck: new Date().toISOString(),
          uptime: status === 'online' ? '99.9%' : '0%',
          hostId: host.hostid,
        };
      }) : [];
      
      setServices(servicesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [api, isAuthenticated]);

  const addService = useCallback((service: Omit<ZabbixService, 'id'>) => {
    const newService: ZabbixService = {
      ...service,
      id: Date.now().toString(),
    };
    setServices(prev => [...prev, newService]);
  }, []);

  const updateService = useCallback((id: string, updates: Partial<ZabbixService>) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, ...updates } : service
    ));
  }, []);

  const deleteService = useCallback((id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  }, []);

  // Auto-refresh services every 30 seconds
  useEffect(() => {
    if (isAuthenticated) {
      fetchServices();
      const interval = setInterval(fetchServices, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchServices]);

  return {
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
  };
};