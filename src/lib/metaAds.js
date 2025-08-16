// Configuração Meta Ads API - substitua pelos valores reais
const META_APP_ID = process.env.REACT_APP_META_APP_ID || 'your_meta_app_id'
const META_APP_SECRET = process.env.REACT_APP_META_APP_SECRET || 'your_meta_app_secret'
const META_API_VERSION = 'v18.0'
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`

// Cliente Meta Ads API
export const metaAds = {
  // Criar campanha
  createCampaign: async (campaignData) => {
    try {
      // Mock data para desenvolvimento
      const mockCampaign = {
        id: `campaign_${Date.now()}`,
        name: campaignData.name,
        status: 'PAUSED',
        objective: 'REACH',
        budget: campaignData.budget,
        created_time: new Date().toISOString(),
        account_id: 'act_mock_account_id'
      }
      
      console.log('Mock: Criando campanha Meta Ads:', mockCampaign)
      return { data: mockCampaign }
    } catch (error) {
      console.error('Erro ao criar campanha:', error)
      throw error
    }
  },

  // Obter campanhas
  getCampaigns: async (accountId) => {
    try {
      // Mock data para desenvolvimento
      const mockCampaigns = [
        {
          id: 'campaign_1',
          name: 'Promoção Delivery - Janeiro',
          status: 'ACTIVE',
          objective: 'CONVERSIONS',
          budget: 500.00,
          spend: 127.50,
          impressions: 15420,
          clicks: 234,
          conversions: 12,
          created_time: '2024-01-15T10:00:00Z'
        },
        {
          id: 'campaign_2',
          name: 'Menu Especial - Fim de Semana',
          status: 'PAUSED',
          objective: 'REACH',
          budget: 300.00,
          spend: 89.30,
          impressions: 8750,
          clicks: 156,
          conversions: 8,
          created_time: '2024-01-10T14:30:00Z'
        }
      ]
      
      return { data: mockCampaigns }
    } catch (error) {
      console.error('Erro ao obter campanhas:', error)
      throw error
    }
  },

  // Atualizar campanha
  updateCampaign: async (campaignId, updateData) => {
    try {
      console.log('Mock: Atualizando campanha:', campaignId, updateData)
      return {
        data: {
          id: campaignId,
          ...updateData,
          updated_time: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error)
      throw error
    }
  },

  // Pausar/Ativar campanha
  updateCampaignStatus: async (campaignId, status) => {
    try {
      console.log('Mock: Alterando status da campanha:', campaignId, 'para', status)
      return {
        data: {
          id: campaignId,
          status: status,
          updated_time: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Erro ao alterar status da campanha:', error)
      throw error
    }
  },

  // Obter insights/métricas
  getCampaignInsights: async (campaignId, dateRange = '7d') => {
    try {
      // Mock data para desenvolvimento
      const mockInsights = {
        campaign_id: campaignId,
        date_start: '2024-01-15',
        date_stop: '2024-01-22',
        impressions: 15420,
        clicks: 234,
        spend: 127.50,
        conversions: 12,
        cpm: 8.27,
        cpc: 0.54,
        ctr: 1.52,
        conversion_rate: 5.13,
        cost_per_conversion: 10.63
      }
      
      return { data: [mockInsights] }
    } catch (error) {
      console.error('Erro ao obter insights:', error)
      throw error
    }
  },

  // Criar conjunto de anúncios
  createAdSet: async (campaignId, adSetData) => {
    try {
      const mockAdSet = {
        id: `adset_${Date.now()}`,
        campaign_id: campaignId,
        name: adSetData.name,
        status: 'PAUSED',
        targeting: adSetData.targeting,
        daily_budget: adSetData.daily_budget,
        created_time: new Date().toISOString()
      }
      
      console.log('Mock: Criando conjunto de anúncios:', mockAdSet)
      return { data: mockAdSet }
    } catch (error) {
      console.error('Erro ao criar conjunto de anúncios:', error)
      throw error
    }
  },

  // Criar anúncio
  createAd: async (adSetId, adData) => {
    try {
      const mockAd = {
        id: `ad_${Date.now()}`,
        adset_id: adSetId,
        name: adData.name,
        status: 'PAUSED',
        creative: adData.creative,
        created_time: new Date().toISOString()
      }
      
      console.log('Mock: Criando anúncio:', mockAd)
      return { data: mockAd }
    } catch (error) {
      console.error('Erro ao criar anúncio:', error)
      throw error
    }
  }
}

// Configurações de targeting padrão
export const targetingOptions = {
  ageRanges: [
    { min: 18, max: 24, label: '18-24 anos' },
    { min: 25, max: 34, label: '25-34 anos' },
    { min: 35, max: 44, label: '35-44 anos' },
    { min: 45, max: 54, label: '45-54 anos' },
    { min: 55, max: 64, label: '55-64 anos' },
    { min: 65, max: null, label: '65+ anos' }
  ],
  
  interests: [
    { id: 'food_delivery', name: 'Delivery de Comida' },
    { id: 'restaurants', name: 'Restaurantes' },
    { id: 'cooking', name: 'Culinária' },
    { id: 'local_business', name: 'Negócios Locais' },
    { id: 'dining_out', name: 'Jantar Fora' }
  ],
  
  placements: [
    { id: 'facebook_feeds', name: 'Feed do Facebook' },
    { id: 'instagram_feeds', name: 'Feed do Instagram' },
    { id: 'facebook_stories', name: 'Stories do Facebook' },
    { id: 'instagram_stories', name: 'Stories do Instagram' },
    { id: 'messenger', name: 'Messenger' }
  ]
}