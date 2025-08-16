import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase - substitua pelos valores reais
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funções auxiliares para autenticação
export const auth = {
  signUp: async (email, password, userData = {}) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
  },

  signIn: async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Funções para gerenciamento de dados
export const database = {
  // Restaurantes
  getRestaurant: async (id) => {
    return await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single()
  },

  updateRestaurant: async (id, data) => {
    return await supabase
      .from('restaurants')
      .update(data)
      .eq('id', id)
  },

  // Cardápios
  getMenus: async (restaurantId) => {
    return await supabase
      .from('menus')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
  },

  createMenu: async (menuData) => {
    return await supabase
      .from('menus')
      .insert(menuData)
  },

  updateMenu: async (id, data) => {
    return await supabase
      .from('menus')
      .update(data)
      .eq('id', id)
  },

  deleteMenu: async (id) => {
    return await supabase
      .from('menus')
      .delete()
      .eq('id', id)
  },

  // Itens do cardápio
  getMenuItems: async (menuId) => {
    return await supabase
      .from('menu_items')
      .select('*')
      .eq('menu_id', menuId)
      .eq('is_available', true)
  },

  createMenuItem: async (itemData) => {
    return await supabase
      .from('menu_items')
      .insert(itemData)
  },

  updateMenuItem: async (id, data) => {
    return await supabase
      .from('menu_items')
      .update(data)
      .eq('id', id)
  },

  deleteMenuItem: async (id) => {
    return await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)
  },

  // Campanhas (para Sprint 3)
  getCampaigns: async (restaurantId) => {
    return await supabase
      .from('ad_campaigns')
      .select('*')
      .eq('restaurant_id', restaurantId)
  },

  createCampaign: async (campaignData) => {
    return await supabase
      .from('ad_campaigns')
      .insert(campaignData)
  },

  // Assinaturas (para Sprint 3)
  getSubscription: async (restaurantId) => {
    return await supabase
      .from('subscriptions')
      .select('*, plans(*)')
      .eq('restaurant_id', restaurantId)
      .eq('status', 'active')
      .single()
  }
}
