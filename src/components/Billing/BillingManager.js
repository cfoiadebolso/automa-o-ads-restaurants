import React, { useState } from 'react'
import { useSubscription } from '../../hooks/useData'
import { createCheckoutSession, createCustomerPortal } from '../../lib/asaas'
import {
  CreditCard,
  Check,
  X,
  Crown,
  Zap,
  Star,
  Calendar,
  DollarSign,
  ExternalLink,
  AlertCircle,
  Gift
} from 'lucide-react'

// Planos disponíveis conforme definido no guia técnico
const PLANS = [
  {
    id: 'basic',
    name: 'Básico',
    price: 97,
    interval: 'month',
    description: 'Ideal para começar',
    features: [
      'Até 3 cardápios',
      'Campanhas básicas do Meta Ads',
      'Landing page simples',
      'Suporte por email',
      'Analytics básico'
    ],
    limitations: [
      'Máximo 1.000 visualizações/mês',
      'Sem automações avançadas',
      'Sem white-label'
    ],
    popular: false,
    color: 'blue'
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 197,
    interval: 'month',
    description: 'Para restaurantes em crescimento',
    features: [
      'Cardápios ilimitados',
      'Campanhas avançadas do Meta Ads',
      'Landing pages personalizadas',
      'Automações de marketing',
      'Analytics avançado',
      'Suporte prioritário',
      'Integração com delivery'
    ],
    limitations: [
      'Máximo 10.000 visualizações/mês'
    ],
    popular: true,
    color: 'purple'
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 397,
    interval: 'month',
    description: 'Para redes e franquias',
    features: [
      'Tudo do plano Profissional',
      'White-label completo',
      'Multi-restaurantes',
      'API personalizada',
      'Suporte dedicado',
      'Treinamento personalizado',
      'Visualizações ilimitadas',
      'Relatórios personalizados'
    ],
    limitations: [],
    popular: false,
    color: 'gold'
  }
]

export default function BillingManager() {
  const { subscription, loading } = useSubscription()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [showBillingHistory, setShowBillingHistory] = useState(false)

  const currentPlan = PLANS.find(plan => plan.id === subscription?.plans?.id) || PLANS[0]

  const handleUpgrade = async (planId) => {
    setIsUpgrading(true)
    try {
      const { url } = await createCheckoutSession(planId)
      window.location.href = url
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsUpgrading(false)
    }
  }

  const handleManageBilling = async () => {
    try {
      const { url } = await createCustomerPortal()
      window.open(url, '_blank')
    } catch (error) {
      console.error('Erro ao abrir portal do cliente:', error)
      alert('Erro ao abrir portal de cobrança. Tente novamente.')
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cobrança e Assinatura</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie seu plano e informações de cobrança
        </p>
      </div>

      {/* Current Plan Status */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Plano Atual</h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${
                currentPlan.color === 'blue' ? 'bg-blue-100' :
                currentPlan.color === 'purple' ? 'bg-purple-100' :
                'bg-yellow-100'
              }`}>
                {currentPlan.color === 'blue' && <Star className="h-6 w-6 text-blue-600" />}
                {currentPlan.color === 'purple' && <Zap className="h-6 w-6 text-purple-600" />}
                {currentPlan.color === 'gold' && <Crown className="h-6 w-6 text-yellow-600" />}
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Plano {currentPlan.name}
                </h4>
                <p className="text-sm text-gray-500">
                  R$ {currentPlan.price}/mês • {currentPlan.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {subscription?.status === 'active' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="w-3 h-3 mr-1" />
                  Ativo
                </span>
              )}
              <button
                onClick={handleManageBilling}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Gerenciar Cobrança
              </button>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Próxima Cobrança
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {subscription?.current_period_end 
                  ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR')
                  : '15/02/2024'
                }
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Valor Mensal
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                R$ {currentPlan.price},00
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <ExternalLink className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Visualizações
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                1.247 / {currentPlan.id === 'enterprise' ? '∞' : currentPlan.id === 'pro' ? '10.000' : '1.000'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Planos Disponíveis</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Gift className="w-4 h-4 mr-1" />
            <span>Desconto anual disponível</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlan={currentPlan}
              isUpgrading={isUpgrading}
              onUpgrade={handleUpgrade}
            />
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Histórico de Cobrança</h3>
            <button
              onClick={() => setShowBillingHistory(!showBillingHistory)}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {showBillingHistory ? 'Ocultar' : 'Ver histórico'}
            </button>
          </div>
        </div>
        {showBillingHistory && (
          <div className="px-6 py-4">
            <BillingHistory />
          </div>
        )}
      </div>

      {/* Support */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Precisa de ajuda com sua cobrança?
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Nossa equipe de suporte está pronta para ajudar com questões de cobrança, 
              mudanças de plano ou cancelamentos.
            </p>
            <div className="mt-3">
              <a
                href="mailto:suporte@automa-ads.com"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Entrar em contato →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlanCard({ plan, currentPlan, isUpgrading, onUpgrade }) {
  const isCurrentPlan = currentPlan.id === plan.id
  const isDowngrade = PLANS.findIndex(p => p.id === currentPlan.id) > PLANS.findIndex(p => p.id === plan.id)
  const isUpgrade = PLANS.findIndex(p => p.id === plan.id) > PLANS.findIndex(p => p.id === currentPlan.id)

  const colorClasses = {
    blue: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    purple: {
      border: 'border-purple-200',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700 text-white'
    },
    gold: {
      border: 'border-yellow-200',
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white'
    }
  }

  const colors = colorClasses[plan.color]

  return (
    <div className={`relative bg-white border-2 rounded-lg p-6 ${
      plan.popular ? 'border-purple-500 shadow-lg' : 'border-gray-200'
    }`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600 text-white">
            <Star className="w-3 h-3 mr-1" />
            Mais Popular
          </span>
        </div>
      )}

      <div className="text-center">
        <div className={`inline-flex p-3 rounded-full ${colors.bg} mb-4`}>
          {plan.color === 'blue' && <Star className={`h-6 w-6 ${colors.text}`} />}
          {plan.color === 'purple' && <Zap className={`h-6 w-6 ${colors.text}`} />}
          {plan.color === 'gold' && <Crown className={`h-6 w-6 ${colors.text}`} />}
        </div>
        
        <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
        
        <div className="mt-4">
          <span className="text-3xl font-bold text-gray-900">R$ {plan.price}</span>
          <span className="text-sm text-gray-500">/mês</span>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Recursos inclusos:</h4>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>

        {plan.limitations.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Limitações:</h4>
            <ul className="space-y-1">
              {plan.limitations.map((limitation, index) => (
                <li key={index} className="flex items-start">
                  <X className="h-4 w-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-500">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6">
        {isCurrentPlan ? (
          <button
            disabled
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-gray-100 cursor-not-allowed"
          >
            Plano Atual
          </button>
        ) : (
          <button
            onClick={() => onUpgrade(plan.id)}
            disabled={isUpgrading}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isDowngrade
                ? 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                : colors.button
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isUpgrading ? 'Processando...' : isDowngrade ? 'Fazer Downgrade' : isUpgrade ? 'Fazer Upgrade' : 'Selecionar Plano'}
          </button>
        )}
      </div>
    </div>
  )
}

function BillingHistory() {
  // Mock data para histórico de cobrança
  const mockInvoices = [
    {
      id: 'inv_001',
      date: '2024-01-15',
      amount: 197.00,
      status: 'paid',
      plan: 'Profissional',
      period: 'Jan 2024'
    },
    {
      id: 'inv_002',
      date: '2023-12-15',
      amount: 197.00,
      status: 'paid',
      plan: 'Profissional',
      period: 'Dez 2023'
    },
    {
      id: 'inv_003',
      date: '2023-11-15',
      amount: 97.00,
      status: 'paid',
      plan: 'Básico',
      period: 'Nov 2023'
    }
  ]

  const statusLabels = {
    paid: { label: 'Pago', color: 'bg-green-100 text-green-800' },
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    failed: { label: 'Falhou', color: 'bg-red-100 text-red-800' }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plano
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Período
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mockInvoices.map((invoice) => {
            const status = statusLabels[invoice.status]
            return (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(invoice.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {invoice.plan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.period}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R$ {invoice.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-500">
                    Download
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
