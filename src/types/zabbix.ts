export interface ZabbixService {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  lastCheck: string;
  uptime: string;
  responseTime?: number;
  hostId?: string;
  itemId?: string;
}

export interface ZabbixAPIResponse<T> {
  jsonrpc: string;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: number;
}

export interface ZabbixAuthRequest {
  jsonrpc: string;
  method: string;
  params: {
    username: string;
    password: string;
  };
  id: number;
}

export interface ZabbixHost {
  hostid: string;
  host: string;
  name: string;
  status: string;
}

export interface ZabbixItem {
  itemid: string;
  name: string;
  lastvalue: string;
  lastclock: string;
  hostid: string;
}

export interface ZabbixTrigger {
  triggerid: string;
  description: string;
  status: string;
  value: string;
  priority: string;
}