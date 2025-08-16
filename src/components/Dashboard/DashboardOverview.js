import React from 'react'
import { useMenus, useCampaigns, useSubscription } from '../../hooks/useData'
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  DollarSign,
  Users,
  BookOpen,
  Megaphone
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Mock data para desenvolvimento
const mockMetrics = {
  totalViews: 1247,
  totalClicks: 89,
  totalSpent: 127.50,
  totalConversions: 12,
  viewsChange: 12.5,
  clicksChange: -3.2,
  spentChange: 8.7,
  conversionsChange: 15.3
}

const mockChartData = [
  { name: 'Seg', views: 120, clicks: 8, conversions: 2 },
  { name: 'Ter', views: 180, clicks: 12, conversions: 3 },
  { name: 'Qua', views: 150, clicks: 10, conversions: 1 },
  { name: 'Qui', views: 220, clicks: 15, conversions: 4 },
  { name: 'Sex', views: 280, clicks: 18, conversions: 6 },
  { name: 'Sáb', views: 320, clicks: 22, conversions: 8 },
  { name: 'Dom', views: 290, clicks: 20, conversions: 5 }
]

const mockTopCampaigns = [
  { name: 'Promoção Delivery - Janeiro', views: 450, clicks: 32, conversions: 8, spent: 45.30 },
  { name: 'Menu Especial - Fim de Semana', views: 320, clicks: 28, conversions: 6, spent: 38.20 },
  { name: 'Happy Hour - Terça', views: 280, clicks: 18, conversions: 4, spent: 25.80 }
]

export default function DashboardOverview() {
  const { menus, loading: menusLoading } = useMenus()
  const { campaigns, loading: campaignsLoading } = useCampaigns()
  const { subscription } = useSubscription()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral do desempenho dos seus cardápios e campanhas
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Visualizações"
          value={mockMetrics.totalViews.toLocaleString()}
          change={mockMetrics.viewsChange}
          icon={Eye}
          color="blue"
        />
        <MetricCard
          title="Cliques"
          value={mockMetrics.totalClicks.toLocaleString()}
          change={mockMetrics.clicksChange}
          icon={MousePointer}
          color="green"
        />
        <MetricCard
          title="Gasto"
          value={`R$ ${mockMetrics.totalSpent.toFixed(2)}`}
          change={mockMetrics.spentChange}
          icon={DollarSign}
          color="yellow"
        />
        <MetricCard
          title="Conversões"
          value={mockMetrics.totalConversions.toLocaleString()}
          change={mockMetrics.conversionsChange}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de linha - Performance semanal */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Performance dos Últimos 7 Dias
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de barras - Conversões */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Conversões por Dia
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="conversions" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumo de recursos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cardápios */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Cardápios</h3>
              <p className="text-2xl font-bold text-blue-600">
                {menusLoading ? '...' : menus.length}
              </p>
              <p className="text-sm text-gray-500">
                {menusLoading ? 'Carregando...' : `${menus.filter(m => m.is_active).length} ativos`}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <a
              href="/menus"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Gerenciar cardápios →
            </a>
          </div>
        </div>

        {/* Campanhas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Megaphone className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Campanhas</h3>
              <p className="text-2xl font-bold text-green-600">
                {campaignsLoading ? '...' : campaigns.length}
              </p>
              <p className="text-sm text-gray-500">
                {campaignsLoading ? 'Carregando...' : `${campaigns.filter(c => c.status === 'active').length} ativas`}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <a
              href="/campaigns"
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              Ver campanhas →
            </a>
          </div>
        </div>

        {/* Plano atual */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Plano Atual</h3>
              <p className="text-2xl font-bold text-purple-600">
                {subscription?.plans?.name || 'Básico'}
              </p>
              <p className="text-sm text-gray-500">
                R$ {subscription?.plans?.price || '97,00'}/mês
              </p>
            </div>
          </div>
          <div className="mt-4">
            <a
              href="/billing"
              className="text-sm font-medium text-purple-600 hover:text-purple-500"
            >
              Gerenciar plano →
            </a>
          </div>
        </div>
      </div>

      {/* Top campanhas */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Campanhas com Melhor Performance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campanha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visualizações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliques
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversões
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gasto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTopCampaigns.map((campaign, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {campaign.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.clicks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.conversions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {campaign.spent.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, icon: Icon, color }) {
  const isPositive = change > 0
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md ${colorClasses[color]}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                  ) : (
                    <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                  )}
                  <span className="ml-1">
                    {Math.abs(change)}%
                  </span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}