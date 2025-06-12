        {activeTab === 'sales' && (
          <div className="space-y-6">
            {/* Анализ продаж на текущую дату */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Динамика продаж за последние 30 дней</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.dailySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={4}
                      />
                      <YAxis tickFormatter={(value) => `${value / 1000}K`} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="Итого" stroke="#6b7280" strokeWidth={3} />
                      <Line type="monotone" dataKey="Ангары" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="Кровля и Фасады" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="Блоки" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Продажи сегодня</CardTitle>
                  <p className="text-sm text-gray-500">{data.salesAnalysis.today.date}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-900">{formatCurrency(data.salesAnalysis.today.sales)}</p>
                      <p className="text-sm text-gray-600 mt-1">Общая сумма продаж</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xl font-bold">{data.salesAnalysis.today.deals}</p>
                        <p className="text-xs text-gray-600">Сделок</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xl font-bold">{formatCurrency(data.salesAnalysis.today.avgDeal)}</p>
                        <p className="text-xs text-gray-600">Средний чек</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">vs вчера</span>
                      <span className="text-lg font-bold text-green-600">{data.salesAnalysis.today.comparison}</span>
                    </div>
                    
                    <div className="text-center text-sm text-gray-600">
                      Лидер продаж: <span className="font-medium text-blue-600">{data.salesAnalysis.today.topProject}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* План-факт помесячно */}
            <Card>
              <CardHeader>
                <CardTitle>План-факт продаж по месяцам 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={data.salesPlan.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `${value / 1000000}M`} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 120]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'процент') return `${value}%`;
                      return formatCurrency(value);
                    }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="план" fill="#e5e7eb" name="План" />
                    <Bar yAxisId="left" dataKey="факт" fill="#3b82f6" name="Факт" />
                    <Line yAxisId="right" type="monotone" dataKey="процент" stroke="#ef4444" strokeWidth={2} name="Выполнение %" />
                  </ComposedChart>
                </ResponsiveContainer>
                
                {/* Сводная информация */}
                import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  Calendar, TrendingUp, TrendingDown, Package, 
  Factory, DollarSign, FileText, Send, Download,
  Building, Home, Layers, Briefcase, ChevronRight,
  ArrowUp, ArrowDown, Activity, Users, Target,
  Clock, AlertCircle, CheckCircle, Truck
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState('all');
  const [dateRange, setDateRange] = useState('week');
  const [data, setData] = useState({
    revenue: [],
    production: [],
    projects: [],
    plans: [],
    weekly: []
  });
  const [loading, setLoading] = useState(true);
  const [presentationMode, setPresentationMode] = useState(false);
  const presentationRef = useRef(null);

  // Цвета для проектов
  const projectColors = {
    'Ангары': '#3b82f6',
    'Кровля': '#10b981',
    'Фасады': '#f59e0b',
    'Блоки': '#8b5cf6',
    'all': '#6b7280'
  };

  // Загрузка данных из файлов
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Здесь должна быть загрузка реальных данных из файлов
      // Для демонстрации используем моковые данные
      const mockData = generateMockData();
      setData(mockData);
      
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setLoading(false);
    }
  };

  // Генерация моковых данных для демонстрации
  const generateMockData = () => {
    const projects = ['Ангары', 'Кровля и Фасады', 'Блоки'];
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
    const currentDate = new Date('2025-06-12');
    
    // Генерация данных продаж на текущую дату
    const salesData = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      salesData.push({
        date: date.toLocaleDateString('ru-RU'),
        'Ангары': Math.floor(Math.random() * 500000) + 300000,
        'Кровля и Фасады': Math.floor(Math.random() * 400000) + 200000,
        'Блоки': Math.floor(Math.random() * 300000) + 150000,
        'Итого': 0 // будет рассчитано
      });
    }
    salesData.forEach(day => {
      day['Итого'] = day['Ангары'] + day['Кровля и Фасады'] + day['Блоки'];
    });
    
    return {
      revenue: months.map(month => ({
        month,
        'Ангары': Math.floor(Math.random() * 5000000) + 3000000,
        'Кровля и Фасады': Math.floor(Math.random() * 4000000) + 2000000,
        'Блоки': Math.floor(Math.random() * 3000000) + 1500000,
      })),
      production: {
        'ЕМЖ': months.map(month => ({
          month,
          'Ангары (тн)': Math.floor(Math.random() * 500) + 400,
          'Прочее (тн)': Math.floor(Math.random() * 300) + 200,
          'Итого (тн)': 0 // будет рассчитано
        })),
        'ЧЛБ': months.map(month => ({
          month,
          'Ангары (тн)': Math.floor(Math.random() * 400) + 300,
          'Прочее (тн)': Math.floor(Math.random() * 200) + 150,
          'Итого (тн)': 0 // будет рассчитано
        }))
      },
      productionTotal: months.map(month => ({
        month,
        'ЕМЖ (тн)': Math.floor(Math.random() * 800) + 600,
        'ЧЛБ (тн)': Math.floor(Math.random() * 600) + 450,
        'Итого (тн)': 0 // будет рассчитано
      })),
      projects: projects.map(project => ({
        name: project,
        revenue: Math.floor(Math.random() * 10000000) + 5000000,
        growth: Math.floor(Math.random() * 30) - 10,
        deals: Math.floor(Math.random() * 50) + 20,
        avgDeal: Math.floor(Math.random() * 500000) + 200000,
      })),
      salesPlan: {
        monthly: months.map(month => ({
          month,
          план: Math.floor(Math.random() * 2000000) + 15000000,
          факт: month === 'Июн' ? Math.floor(Math.random() * 1000000) + 8000000 : Math.floor(Math.random() * 2000000) + 14000000,
          процент: 0 // будет рассчитано
        }))
      },
      salesAnalysis: {
        today: {
          date: '12.06.2025',
          sales: 1247500,
          deals: 8,
          avgDeal: 155937,
          topProject: 'Ангары',
          comparison: '+15.3%' // vs вчера
        },
        mtd: { // Month to date
          sales: 14732000,
          plan: 17000000,
          percent: 86.7,
          forecast: 28500000 // прогноз на месяц
        },
        ytd: { // Year to date
          sales: 78452000,
          plan: 85000000,
          percent: 92.3
        }
      },
      weekly: {
        current: {
          revenue: 12500000,
          deals: 45,
          production: 2850,
          shipments: 38
        },
        previous: {
          revenue: 11200000,
          deals: 42,
          production: 2720,
          shipments: 35
        }
      },
      dailySales: salesData
    };
  };

  // Расчет ключевых метрик
  const calculateMetrics = () => {
    const currentWeek = data.weekly.current;
    const previousWeek = data.weekly.previous;
    
    return {
      revenueGrowth: ((currentWeek.revenue - previousWeek.revenue) / previousWeek.revenue * 100).toFixed(1),
      dealsGrowth: ((currentWeek.deals - previousWeek.deals) / previousWeek.deals * 100).toFixed(1),
      productionGrowth: ((currentWeek.production - previousWeek.production) / previousWeek.production * 100).toFixed(1),
      shipmentsGrowth: ((currentWeek.shipments - previousWeek.shipments) / previousWeek.shipments * 100).toFixed(1),
    };
  };

  // Форматирование чисел
  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Экспорт в презентацию
  const exportToPresentation = () => {
    const wb = XLSX.utils.book_new();
    
    // Лист с основными показателями
    const summaryData = [
      ['Еженедельный отчет ИНСИ', '', '', new Date().toLocaleDateString('ru-RU')],
      [''],
      ['Показатель', 'Текущая неделя', 'Прошлая неделя', 'Изменение %'],
      ['Выручка', data.weekly.current.revenue, data.weekly.previous.revenue, calculateMetrics().revenueGrowth],
      ['Количество сделок', data.weekly.current.deals, data.weekly.previous.deals, calculateMetrics().dealsGrowth],
      ['Производство', data.weekly.current.production, data.weekly.previous.production, calculateMetrics().productionGrowth],
      ['Отгрузки', data.weekly.current.shipments, data.weekly.previous.shipments, calculateMetrics().shipmentsGrowth],
    ];
    
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Сводка');
    
    // Лист с проектами
    const projectsData = [
      ['Показатели по проектам'],
      [''],
      ['Проект', 'Выручка', 'Рост %', 'Сделок', 'Средний чек'],
      ...data.projects.map(p => [p.name, p.revenue, p.growth, p.deals, p.avgDeal])
    ];
    
    const ws2 = XLSX.utils.aoa_to_sheet(projectsData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Проекты');
    
    // Сохранение файла
    XLSX.writeFile(wb, `Отчет_ИНСИ_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Отправка по email (заглушка)
  const sendByEmail = () => {
    alert('Отчет будет отправлен руководителям на email');
    // Здесь должна быть интеграция с email сервисом
  };

  // Компонент метрики
  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
    const isPositive = parseFloat(change) >= 0;
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      amber: 'bg-amber-50 text-amber-600',
      purple: 'bg-purple-50 text-purple-600'
    };
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              <div className="flex items-center mt-2">
                {isPositive ? (
                  <ArrowUp className="w-4 h-4 mr-1 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1 text-red-500" />
                )}
                <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {change}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs прошлая неделя</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  const metrics = calculateMetrics();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Дашборд ИНСИ</h1>
                <p className="text-sm text-gray-500">Еженедельный отчет по производству и продажам</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                className="px-4 py-2 border rounded-lg"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="week">Эта неделя</option>
                <option value="month">Этот месяц</option>
                <option value="quarter">Этот квартал</option>
                <option value="year">Этот год</option>
              </select>
              <button
                onClick={exportToPresentation}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </button>
              <button
                onClick={sendByEmail}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Табы навигации */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Обзор', icon: Activity },
              { id: 'sales', name: 'Анализ продаж', icon: TrendingUp },
              { id: 'revenue', name: 'Выручка', icon: DollarSign },
              { id: 'production', name: 'Производство', icon: Factory },
              { id: 'projects', name: 'Проекты', icon: Briefcase },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Фильтр по проектам */}
        {activeTab !== 'overview' && (
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Проект:</span>
              <div className="flex space-x-2">
                {['all', 'Ангары', 'Кровля и Фасады', 'Блоки'].map((project) => (
                  <button
                    key={project}
                    onClick={() => setSelectedProject(project)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedProject === project
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {project === 'all' ? 'Все проекты' : project}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Контент в зависимости от активной вкладки */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Ключевые метрики */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Выручка за неделю"
                value={formatCurrency(data.weekly.current.revenue)}
                change={metrics.revenueGrowth}
                icon={DollarSign}
                color="blue"
              />
              <MetricCard
                title="Количество сделок"
                value={data.weekly.current.deals}
                change={metrics.dealsGrowth}
                icon={Briefcase}
                color="green"
              />
              <MetricCard
                title="Произведено единиц"
                value={formatNumber(data.weekly.current.production)}
                change={metrics.productionGrowth}
                icon={Factory}
                color="amber"
              />
              <MetricCard
                title="Отгрузок"
                value={data.weekly.current.shipments}
                change={metrics.shipmentsGrowth}
                icon={Truck}
                color="purple"
              />
            </div>

            {/* Графики */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* График выручки по проектам */}
              <Card>
                <CardHeader>
                  <CardTitle>Выручка по проектам (6 месяцев)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data.revenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        labelStyle={{ color: '#000' }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="Ангары" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                      <Area type="monotone" dataKey="Кровля и Фасады" stackId="1" stroke="#10b981" fill="#10b981" />
                      <Area type="monotone" dataKey="Блоки" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* План-факт продаж */}
              <Card>
                <CardHeader>
                  <CardTitle>План-факт продаж на {data.salesAnalysis.today.date}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Продажи сегодня */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-3">Продажи сегодня</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Сумма продаж</p>
                          <p className="text-xl font-bold text-blue-900">{formatCurrency(data.salesAnalysis.today.sales)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Количество сделок</p>
                          <p className="text-xl font-bold text-blue-900">{data.salesAnalysis.today.deals}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Средний чек</p>
                          <p className="text-xl font-bold text-blue-900">{formatCurrency(data.salesAnalysis.today.avgDeal)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">vs вчера</p>
                          <p className="text-xl font-bold text-green-600">{data.salesAnalysis.today.comparison}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* План-факт за месяц */}
                    <div>
                      <h4 className="font-medium mb-2">Июнь 2025 (на текущую дату)</h4>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Выполнение плана</span>
                        <span className="text-sm font-medium">{data.salesAnalysis.mtd.percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${data.salesAnalysis.mtd.percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Факт: {formatCurrency(data.salesAnalysis.mtd.sales)}</span>
                        <span>План: {formatCurrency(data.salesAnalysis.mtd.plan)}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Прогноз на месяц: <span className="font-medium">{formatCurrency(data.salesAnalysis.mtd.forecast)}</span>
                      </div>
                    </div>
                    
                    {/* План-факт за год */}
                    <div>
                      <h4 className="font-medium mb-2">2025 год (YTD)</h4>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Выполнение плана</span>
                        <span className="text-sm font-medium">{data.salesAnalysis.ytd.percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${data.salesAnalysis.ytd.percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Факт: {formatCurrency(data.salesAnalysis.ytd.sales)}</span>
                        <span>План: {formatCurrency(data.salesAnalysis.ytd.plan)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Производственные показатели */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Производство по площадкам (тонны)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <ComposedChart data={data.productionTotal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="ЕМЖ (тн)" fill="#3b82f6" />
                      <Bar dataKey="ЧЛБ (тн)" fill="#10b981" />
                      <Line type="monotone" dataKey="Итого (тн)" stroke="#ef4444" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Производство ангаров по площадкам</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Площадка ЕМЖ</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Ангары за месяц:</span>
                        <span className="text-lg font-bold text-blue-900">450 тн</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Прочее производство:</span>
                        <span className="text-lg font-bold text-blue-900">250 тн</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Площадка ЧЛБ</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Ангары за месяц:</span>
                        <span className="text-lg font-bold text-green-900">350 тн</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Прочее производство:</span>
                        <span className="text-lg font-bold text-green-900">175 тн</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <h4 className="font-medium mb-2">Итого ангаров (две площадки)</h4>
                      <div className="text-2xl font-bold text-center">800 тн</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Важные уведомления */}
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription>
                <span className="font-medium text-amber-800">Внимание:</span> Производство ЧЛБ отстает от плана на 12%. 
                Рекомендуется провести анализ причин и разработать корректирующие мероприятия.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Динамика выручки</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    {selectedProject === 'all' ? (
                      <>
                        <Line type="monotone" dataKey="Ангары" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="Кровля и Фасады" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="Блоки" stroke="#8b5cf6" strokeWidth={2} />
                      </>
                    ) : (
                      <Line 
                        type="monotone" 
                        dataKey={selectedProject} 
                        stroke={projectColors[selectedProject]} 
                        strokeWidth={3} 
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Детальная статистика */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {data.projects.map((project) => (
                <Card key={project.name}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Выручка</p>
                        <p className="text-xl font-bold">{formatCurrency(project.revenue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Количество сделок</p>
                        <p className="text-xl font-bold">{project.deals}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Средний чек</p>
                        <p className="text-xl font-bold">{formatCurrency(project.avgDeal)}</p>
                      </div>
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Рост</span>
                          <span className={`text-sm font-medium ${
                            project.growth >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {project.growth >= 0 ? '+' : ''}{project.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'production' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Производство ЕМЖ - детальный анализ</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.production.ЕМЖ}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="план" fill="#e5e7eb" name="План" />
                      <Bar dataKey="факт" fill="#3b82f6" name="Факт" />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">Средняя эффективность</span>
                      <span className="text-lg font-bold text-blue-900">92.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Производство ЧЛБ - детальный анализ</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.production.ЧЛБ}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="план" fill="#e5e7eb" name="План" />
                      <Bar dataKey="факт" fill="#10b981" name="Факт" />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-900">Средняя эффективность</span>
                      <span className="text-lg font-bold text-red-900">88.0%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Сводная таблица */}
            <Card>
              <CardHeader>
                <CardTitle>Сводная таблица производства</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Цех</th>
                        <th className="text-right py-3 px-4">План (мес)</th>
                        <th className="text-right py-3 px-4">Факт (мес)</th>
                        <th className="text-right py-3 px-4">Выполнение</th>
                        <th className="text-right py-3 px-4">Отклонение</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">ЕМЖ</td>
                        <td className="text-right py-3 px-4">950</td>
                        <td className="text-right py-3 px-4">878</td>
                        <td className="text-right py-3 px-4">92.5%</td>
                        <td className="text-right py-3 px-4 text-red-600">-72</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">ЧЛБ</td>
                        <td className="text-right py-3 px-4">750</td>
                        <td className="text-right py-3 px-4">660</td>
                        <td className="text-right py-3 px-4">88.0%</td>
                        <td className="text-right py-3 px-4 text-red-600">-90</td>
                      </tr>
                      <tr className="font-bold bg-gray-50">
                        <td className="py-3 px-4">Итого</td>
                        <td className="text-right py-3 px-4">1,700</td>
                        <td className="text-right py-3 px-4">1,538</td>
                        <td className="text-right py-3 px-4">90.5%</td>
                        <td className="text-right py-3 px-4 text-red-600">-162</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Распределение выручки по проектам */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Распределение выручки</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.projects}
                        dataKey="revenue"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry.name}: ${(entry.revenue / data.projects.reduce((a, b) => a + b.revenue, 0) * 100).toFixed(1)}%`}
                      >
                        {data.projects.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={Object.values(projectColors)[index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Сравнение проектов</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.projects} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `${value / 1000000}M`} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="revenue" fill="#3b82f6">
                        {data.projects.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={Object.values(projectColors)[index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Детальная информация по каждому проекту */}
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <Card key={project.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: Object.values(projectColors)[index] }}
                        />
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Выручка</p>
                        <p className="text-lg font-semibold">{formatCurrency(project.revenue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Рост</p>
                        <p className={`text-lg font-semibold ${
                          project.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {project.growth >= 0 ? '+' : ''}{project.growth}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Сделок</p>
                        <p className="text-lg font-semibold">{project.deals}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Средний чек</p>
                        <p className="text-lg font-semibold">{formatCurrency(project.avgDeal)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Выполнение планов 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Квартальные планы */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Квартальные показатели</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((quarter) => {
                        const isCurrentQuarter = quarter === 2; // Текущий квартал
                        const progress = isCurrentQuarter ? 85.6 : quarter < 2 ? 100 : 0;
                        
                        return (
                          <div key={quarter} className={`p-4 rounded-lg ${
                            isCurrentQuarter ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                          }`}>
                            <h5 className="font-medium mb-2">Q{quarter} 2025</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>План:</span>
                                <span className="font-medium">{formatCurrency(45000000)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Факт:</span>
                                <span className="font-medium">
                                  {quarter < 2 ? formatCurrency(45000000) : 
                                   quarter === 2 ? formatCurrency(38500000) : 
                                   '-'}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    progress === 100 ? 'bg-green-600' : 
                                    progress > 0 ? 'bg-blue-600' : 
                                    'bg-gray-300'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <div className="text-xs text-right">
                                {progress > 0 ? `${progress}%` : 'Не начат'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Годовой план с разбивкой по месяцам */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Помесячная динамика</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={[
                        { month: 'Янв', план: 15000000, факт: 14200000 },
                        { month: 'Фев', план: 15000000, факт: 13800000 },
                        { month: 'Мар', план: 15000000, факт: 15500000 },
                        { month: 'Апр', план: 15000000, факт: 14700000 },
                        { month: 'Май', план: 15000000, факт: 12300000 },
                        { month: 'Июн', план: 15000000, факт: 0 },
                        { month: 'Июл', план: 15000000, факт: 0 },
                        { month: 'Авг', план: 15000000, факт: 0 },
                        { month: 'Сен', план: 15000000, факт: 0 },
                        { month: 'Окт', план: 15000000, факт: 0 },
                        { month: 'Ноя', план: 15000000, факт: 0 },
                        { month: 'Дек', план: 15000000, факт: 0 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="план" fill="#e5e7eb" />
                        <Bar dataKey="факт" fill="#3b82f6" />
                        <Line 
                          type="monotone" 
                          dataKey="план" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Прогноз выполнения */}
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      При текущих темпах выручки прогнозируется выполнение годового плана на <strong>92%</strong>. 
                      Для достижения 100% необходимо увеличить среднемесячную выручку на <strong>8.5%</strong>.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;