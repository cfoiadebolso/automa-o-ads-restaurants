import React, { useState } from 'react'
import { useCampaigns } from '../../hooks/useData'
import {
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Eye,
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Users,
  MousePointer,
  Calendar,
  BarChart3
} from 'lucide-react'

// Mock data para métricas das campanhas
const mockCampaignMetrics = {
  'campaign-1': {
    impressions: 12450,
    clicks: 234,
    conversions: 18,
    spent: 127.50,
    ctr: 1.88,
    cpc: 0.54,
    cpm: 10.25
  },
  'campaign-2': {
    impressions: 8920,
    clicks: 156,
    conversions: 12,
    spent: 89.30,
    ctr: 1.75,
    cpc: 0.57,
    cpm: 10.01
  }
}

export default function CampaignManager() {
  const { campaigns, loading, createCampaign, updateCampaign, deleteCampaign } = useCampaigns()
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showMetricsModal, setShowMetricsModal] = useState(false)

  const handleCreateCampaign = async (campaignData) => {
    try {
      await createCampaign(campaignData)
      setShowCreateModal(false)
    } catch (error) {
      console.error('Erro ao criar campanha:', error)
    }
  }

  const handleUpdateCampaign = async (campaignData) => {
    try {
      await updateCampaign(selectedCampaign.id, campaignData)
      setShowEditModal(false)
      setSelectedCampaign(null)
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error)
    }
  }

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      try {
        await deleteCampaign(campaignId)
      } catch (error) {
        console.error('Erro ao excluir campanha:', error)
      }
    }
  }

  const toggleCampaignStatus = async (campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active'
    try {
      await updateCampaign(campaign.id, { status: newStatus })
    } catch (error) {
      console.error('Erro ao alterar status da campanha:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campanhas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie suas campanhas do Meta Ads
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Campanhas Ativas"
          value={campaigns.filter(c => c.status === 'active').length}
          icon={Play}
          color="green"
        />
        <SummaryCard
          title="Total de Campanhas"
          value={campaigns.length}
          icon={Target}
          color="blue"
        />
        <SummaryCard
          title="Gasto Total"
          value={`R$ ${Object.values(mockCampaignMetrics).reduce((sum, m) => sum + m.spent, 0).toFixed(2)}`}
          icon={DollarSign}
          color="yellow"
        />
        <SummaryCard
          title="Total de Cliques"
          value={Object.values(mockCampaignMetrics).reduce((sum, m) => sum + m.clicks, 0)}
          icon={MousePointer}
          color="purple"
        />
      </div>

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma campanha encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece criando sua primeira campanha do Meta Ads.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Campanha
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                metrics={mockCampaignMetrics[campaign.id] || {}}
                onEdit={(campaign) => {
                  setSelectedCampaign(campaign)
                  setShowEditModal(true)
                }}
                onDelete={handleDeleteCampaign}
                onToggleStatus={toggleCampaignStatus}
                onViewMetrics={(campaign) => {
                  setSelectedCampaign(campaign)
                  setShowMetricsModal(true)
                }}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CampaignModal
          title="Criar Nova Campanha"
          onSave={handleCreateCampaign}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Campaign Modal */}
      {showEditModal && selectedCampaign && (
        <CampaignModal
          title="Editar Campanha"
          campaign={selectedCampaign}
          onSave={handleUpdateCampaign}
          onClose={() => {
            setShowEditModal(false)
            setSelectedCampaign(null)
          }}
        />
      )}

      {/* Metrics Modal */}
      {showMetricsModal && selectedCampaign && (
        <CampaignMetricsModal
          campaign={selectedCampaign}
          metrics={mockCampaignMetrics[selectedCampaign.id] || {}}
          onClose={() => {
            setShowMetricsModal(false)
            setSelectedCampaign(null)
          }}
        />
      )}
    </div>
  )
}

function SummaryCard({ title, value, icon: Icon, color }) {
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
              <dd className="text-2xl font-semibold text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

function CampaignCard({ campaign, metrics, onEdit, onDelete, onToggleStatus, onViewMetrics }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800'
  }

  const statusLabels = {
    active: 'Ativa',
    paused: 'Pausada',
    completed: 'Finalizada'
  }

  return (
    <li className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {campaign.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {campaign.objective} • Orçamento: R$ {campaign.budget?.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusColors[campaign.status]
                }`}>
                  {statusLabels[campaign.status]}
                </span>
              </div>
            </div>

            {/* Metrics */}
            {Object.keys(metrics).length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {metrics.impressions?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-gray-500">Impressões</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {metrics.clicks || '0'}
                  </div>
                  <div className="text-xs text-gray-500">Cliques</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {metrics.conversions || '0'}
                  </div>
                  <div className="text-xs text-gray-500">Conversões</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    R$ {metrics.spent?.toFixed(2) || '0,00'}
                  </div>
                  <div className="text-xs text-gray-500">Gasto</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onViewMetrics(campaign)}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Ver métricas"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(campaign)}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleStatus(campaign)}
            className={`p-2 hover:text-gray-600 ${
              campaign.status === 'active' ? 'text-yellow-600' : 'text-green-600'
            }`}
            title={campaign.status === 'active' ? 'Pausar' : 'Ativar'}
          >
            {campaign.status === 'active' ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onDelete(campaign.id)}
            className="p-2 text-gray-400 hover:text-red-600"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  )
}

function CampaignModal({ title, campaign, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    objective: campaign?.objective || 'CONVERSIONS',
    budget: campaign?.budget || '',
    target_audience: campaign?.target_audience || '',
    ad_creative: campaign?.ad_creative || '',
    start_date: campaign?.start_date || '',
    end_date: campaign?.end_date || '',
    status: campaign?.status || 'paused'
  })
  const [loading, setLoading] = useState(false)

  const objectives = [
    { value: 'CONVERSIONS', label: 'Conversões' },
    { value: 'TRAFFIC', label: 'Tráfego' },
    { value: 'REACH', label: 'Alcance' },
    { value: 'BRAND_AWARENESS', label: 'Reconhecimento da Marca' },
    { value: 'LEAD_GENERATION', label: 'Geração de Leads' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({
        ...formData,
        budget: parseFloat(formData.budget) || 0
      })
    } catch (error) {
      console.error('Erro ao salvar campanha:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome da Campanha *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Promoção Delivery Janeiro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Objetivo *
              </label>
              <select
                required
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {objectives.map(objective => (
                  <option key={objective.value} value={objective.value}>
                    {objective.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Orçamento Diário (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="50.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Público-Alvo
              </label>
              <textarea
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva seu público-alvo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Criativo do Anúncio
              </label>
              <textarea
                value={formData.ad_creative}
                onChange={(e) => setFormData({ ...formData, ad_creative: e.target.value })}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Texto do anúncio, imagens, etc..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Fim
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="paused">Pausada</option>
                <option value="active">Ativa</option>
                <option value="completed">Finalizada</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function CampaignMetricsModal({ campaign, metrics, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Métricas: {campaign.name}
            </h3>
            <p className="text-sm text-gray-500">
              Performance detalhada da campanha
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Fechar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Métricas principais */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Métricas Principais</h4>
            <div className="space-y-3">
              <MetricItem
                label="Impressões"
                value={metrics.impressions?.toLocaleString() || '0'}
                icon={Eye}
              />
              <MetricItem
                label="Cliques"
                value={metrics.clicks || '0'}
                icon={MousePointer}
              />
              <MetricItem
                label="Conversões"
                value={metrics.conversions || '0'}
                icon={Target}
              />
              <MetricItem
                label="Gasto"
                value={`R$ ${metrics.spent?.toFixed(2) || '0,00'}`}
                icon={DollarSign}
              />
            </div>
          </div>

          {/* Métricas calculadas */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Métricas Calculadas</h4>
            <div className="space-y-3">
              <MetricItem
                label="CTR (Taxa de Cliques)"
                value={`${metrics.ctr?.toFixed(2) || '0,00'}%`}
                icon={TrendingUp}
              />
              <MetricItem
                label="CPC (Custo por Clique)"
                value={`R$ ${metrics.cpc?.toFixed(2) || '0,00'}`}
                icon={DollarSign}
              />
              <MetricItem
                label="CPM (Custo por Mil)"
                value={`R$ ${metrics.cpm?.toFixed(2) || '0,00'}`}
                icon={BarChart3}
              />
              <MetricItem
                label="Taxa de Conversão"
                value={`${metrics.clicks > 0 ? ((metrics.conversions / metrics.clicks) * 100).toFixed(2) : '0,00'}%`}
                icon={Target}
              />
            </div>
          </div>
        </div>

        {/* Informações da campanha */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Informações da Campanha</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <span className="text-sm text-gray-500">Objetivo:</span>
              <p className="text-sm font-medium text-gray-900">{campaign.objective}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Orçamento Diário:</span>
              <p className="text-sm font-medium text-gray-900">R$ {campaign.budget?.toFixed(2)}</p>
            </div>
            {campaign.start_date && (
              <div>
                <span className="text-sm text-gray-500">Data de Início:</span>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(campaign.start_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
            {campaign.end_date && (
              <div>
                <span className="text-sm text-gray-500">Data de Fim:</span>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(campaign.end_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricItem({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <Icon className="w-4 h-4 text-gray-400 mr-2" />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}