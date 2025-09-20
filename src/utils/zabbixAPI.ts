import { ZabbixAPIResponse, ZabbixAuthRequest } from '../types/zabbix';

class ZabbixAPI {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Set token directly without authentication
  setAuthToken(token: string) {
    this.authToken = token;
  }

  private async makeRequest<T>(method: string, params: any): Promise<T> {
    const requestBody = {
      jsonrpc: '2.0',
      method,
      params,
      id: Date.now(),
      ...(this.authToken && { auth: this.authToken })
    };

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ZabbixAPIResponse<T> = await response.json();

      if (data.error) {
        throw new Error(`Zabbix API error: ${data.error.message}`);
      }

      return data.result as T;
    } catch (error) {
      console.error('Zabbix API request failed:', error);
      throw error;
    }
  }

  async authenticate(username: string, password: string): Promise<string> {
    try {
      const authToken = await this.makeRequest<string>('user.login', {
        username,
        password,
      });
      
      this.authToken = authToken;
      return authToken;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  async getHosts() {
    if (!this.authToken) {
      throw new Error('Not authenticated');
    }

    return this.makeRequest('host.get', {
      output: ['hostid', 'host', 'name', 'status'],
      selectItems: ['itemid', 'name', 'lastvalue', 'lastclock'],
      selectTriggers: ['triggerid', 'description', 'status', 'value', 'priority'],
    });
  }

  async getItems(hostIds: string[]) {
    if (!this.authToken) {
      throw new Error('Not authenticated');
    }

    return this.makeRequest('item.get', {
      output: ['itemid', 'name', 'lastvalue', 'lastclock', 'hostid'],
      hostids: hostIds,
      monitored: true,
    });
  }

  async getTriggers(hostIds?: string[]) {
    if (!this.authToken) {
      throw new Error('Not authenticated');
    }

    return this.makeRequest('trigger.get', {
      output: ['triggerid', 'description', 'status', 'value', 'priority'],
      ...(hostIds && { hostids: hostIds }),
      monitored: true,
      skipDependent: true,
    });
  }

  logout() {
    if (this.authToken) {
      this.makeRequest('user.logout', {}).catch(console.error);
      this.authToken = null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.authToken;
  }
}

export default ZabbixAPI;