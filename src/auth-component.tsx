import React, { useState, useEffect } from 'react';
import { Shield, User, Building2 } from 'lucide-react';

interface User {
  role: string;
  permissions: string[];
  name: string;
}

const USERS_DATABASE = {
  'director2025': { 
    role: 'Директор', 
    name: 'Руководство ИНСИ',
    permissions: ['все_данные', 'экспорт', 'настройки', 'отчеты'] 
  },
  'cfo2025': { 
    role: 'Финансовый директор', 
    name: 'Финансовый отдел',
    permissions: ['финансы', 'экспорт', 'отчеты'] 
  },
  'sales2025': { 
    role: 'Коммерческий директор', 
    name: 'Отдел продаж',
    permissions: ['продажи', 'проекты', 'экспорт'] 
  },
  'manager2025': { 
    role: 'Менеджер', 
    name: 'Менеджер проектов',
    permissions: ['проекты', 'просмотр'] 
  },
  'analyst2025': { 
    role: 'Аналитик', 
    name: 'Аналитик',
    permissions: ['просмотр'] 
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Проверяем сохраненную авторизацию
    const savedAuth = localStorage.getItem('insi_auth');
    const savedUser = localStorage.getItem('insi_user');
    
    if (savedAuth === 'true' && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string): boolean => {
    const userData = USERS_DATABASE[password as keyof typeof USERS_DATABASE];
    
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('insi_auth', 'true');
      localStorage.setItem('insi_user', JSON.stringify(userData));
      
      // Логируем вход
      console.log(`🔐 Вход в систему: ${userData.name} (${userData.role})`);
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('insi_auth');
    localStorage.removeItem('insi_user');
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || 
           user?.permissions.includes('все_данные') || 
           false;
  };

  return { user, isAuthenticated, login, logout, hasPermission };
};

export const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const { login } = useAuth();

  const handleLogin = () => {
    if (attempts >= 3) {
      setError('Превышено количество попыток. Обратитесь к администратору.');
      return;
    }

    const success = login(password);
    
    if (success) {
      onLogin();
      setError('');
    } else {
      setAttempts(prev => prev + 1);
      setError(`Неверный пароль доступа (попытка ${attempts + 1}/3)`);
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Логотип компании */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">ИНСИ</h1>
          <p className="text-gray-500 mt-2">Система аналитики и отчетности</p>
        </div>

        {/* Форма входа */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield className="inline w-4 h-4 mr-2" />
              Пароль доступа
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите пароль доступа"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={attempts >= 3}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={!password || attempts >= 3}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <User className="inline w-4 h-4 mr-2" />
            Войти в систему
          </button>
        </div>

        {/* Информация о доступе */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Уровни доступа:</h3>
          <div className="space-y-2 text-xs text-gray-500">
            <div>👑 <strong>Директор:</strong> Полный доступ</div>
            <div>💰 <strong>Финансовый директор:</strong> Финансы + экспорт</div>
            <div>📊 <strong>Коммерческий директор:</strong> Продажи + проекты</div>
            <div>👤 <strong>Менеджер:</strong> Проекты</div>
            <div>📈 <strong>Аналитик:</strong> Только просмотр</div>
          </div>
        </div>

        {/* Контакты */}
        <div className="mt-6 text-center text-xs text-gray-400">
          Проблемы с доступом? Обратитесь к IT-отделу
        </div>
      </div>
    </div>
  );
};

export const UserInfo: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-full p-2">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.role}</div>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Выйти из системы"
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-1">
        {user.permissions.map(permission => (
          <span 
            key={permission}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
          >
            {permission}
          </span>
        ))}
      </div>
    </div>
  );
}; 