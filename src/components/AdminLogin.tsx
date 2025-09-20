import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  onTokenLogin: (token: string) => boolean;
  loading: boolean;
  error: string | null;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onTokenLogin, loading, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'credentials' | 'token'>('credentials');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'credentials') {
      if (username.trim() && password.trim()) {
        await onLogin(username.trim(), password);
      }
    } else {
      if (token.trim()) {
        onTokenLogin(token.trim());
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the Zabbix Status Dashboard
          </p>
        </div>
        
        {/* Auth Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setAuthMode('credentials')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              authMode === 'credentials'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Username & Password
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('token')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              authMode === 'token'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Auth Token
          </button>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {authMode === 'credentials' ? (
              <>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your username"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                  Authentication Token
                </label>
                <input
                  id="token"
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
                  placeholder="Enter your Zabbix auth token"
                  disabled={loading}
                />
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || (authMode === 'credentials' ? (!username.trim() || !password.trim()) : !token.trim())}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {authMode === 'credentials' 
              ? 'Use your Zabbix credentials to access the dashboard'
              : 'Use your Zabbix authentication token to access the dashboard'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;