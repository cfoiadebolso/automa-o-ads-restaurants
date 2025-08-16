// Configuração do ASAAS - substitua pela chave real
const asaasConfig = {
  apiKey: process.env.REACT_APP_ASAAS_API_KEY,
  baseURL: process.env.REACT_APP_ASAAS_SANDBOX === 'true' 
    ? 'https://sandbox.asaas.com/api/v3'
    : 'https://api.asaas.com/v3'
}

// Criar sessão de checkout
export const createCheckoutSession = async (priceId, customerId = null) => {
  try {
    // Esta função será implementada quando o backend estiver pronto
    // Por enquanto, retorna dados mockados
    return {
      url: `${asaasConfig.baseURL}/payments/mock-checkout`,
      paymentId: 'pay_mock_' + Date.now()
    }
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error)
    throw error
  }
}

// Gerenciar portal do cliente
export const createCustomerPortal = async (customerId) => {
  try {
    // Esta função será implementada quando o backend estiver pronto
    return {
      url: `${asaasConfig.baseURL}/customers/${customerId}/portal`
    }
  } catch (error) {
    console.error('Erro ao criar portal do cliente:', error)
    throw error
  }
}

// Criar assinatura
export const createSubscription = async (customerId, planId) => {
  try {
    console.log('Creating ASAAS subscription:', { customerId, planId })
    return {
      id: 'sub_mock_' + Date.now(),
      status: 'active'
    }
  } catch (error) {
    console.error('Erro ao criar assinatura:', error)
    throw error
  }
}

// Objeto principal do ASAAS
export const asaas = {
  createCheckoutSession,
  createCustomerPortal,
  createSubscription,

  // Obter informações de assinatura
  getSubscription: async (subscriptionId) => {
    try {
      // Mock data para desenvolvimento
      return {
        id: subscriptionId,
        status: 'active',
        current_period_end: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 dias
        plan: {
          id: 'price_basic_monthly',
          name: 'Plano Básico',
          amount: 9700, // R$ 97,00 em centavos
          currency: 'brl'
        }
      }
    } catch (error) {
      console.error('Erro ao obter assinatura:', error)
      throw error
    }
  }
}

export default asaas

// Planos disponíveis (conforme guia técnico)
export const plans = [
  {
    id: 'price_basic_monthly',
    name: 'Básico',
    price: 97.00,
    currency: 'BRL',
    interval: 'month',
    features: [
      '1 cardápio',
      'Até 50 itens',
      'Orçamento de anúncios: R$ 500',
      'Suporte por email'
    ],
    maxMenus: 1,
    maxItems: 50,
    adsBudgetLimit: 500.00
  },
  {
    id: 'price_pro_monthly',
    name: 'Pro',
    price: 197.00,
    currency: 'BRL',
    interval: 'month',
    features: [
      '3 cardápios',
      'Até 150 itens',
      'Orçamento de anúncios: R$ 1.500',
      'Analytics avançados',
      'Suporte prioritário'
    ],
    maxMenus: 3,
    maxItems: 150,
    adsBudgetLimit: 1500.00
  },
  {
    id: 'price_enterprise_monthly',
    name: 'Enterprise',
    price: 397.00,
    currency: 'BRL',
    interval: 'month',
    features: [
      '10 cardápios',
      'Até 500 itens',
      'Orçamento de anúncios: R$ 5.000',
      'White-label',
      'API personalizada',
      'Suporte dedicado'
    ],
    maxMenus: 10,
    maxItems: 500,
    adsBudgetLimit: 5000.00
  }
]