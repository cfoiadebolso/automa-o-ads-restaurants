import { useState, useEffect } from 'react'
import { database } from '../lib/supabase'
import { useAuth } from './useAuth'

// Hook para gerenciar dados do restaurante
export function useRestaurant() {
  const { user } = useAuth()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadRestaurant()
    }
  }, [user])

  const loadRestaurant = async () => {
    try {
      setLoading(true)
      const { data, error } = await database.getRestaurant(user.id)
      if (error) throw error
      setRestaurant(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateRestaurant = async (updateData) => {
    try {
      const { data, error } = await database.updateRestaurant(user.id, updateData)
      if (error) throw error
      setRestaurant(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    restaurant,
    loading,
    error,
    updateRestaurant,
    refetch: loadRestaurant
  }
}

// Hook para gerenciar cardápios
export function useMenus() {
  const { user } = useAuth()
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadMenus()
    }
  }, [user])

  const loadMenus = async () => {
    try {
      setLoading(true)
      const { data, error } = await database.getMenus(user.id)
      if (error) throw error
      setMenus(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createMenu = async (menuData) => {
    try {
      const { data, error } = await database.createMenu({
        ...menuData,
        restaurant_id: user.id
      })
      if (error) throw error
      await loadMenus() // Recarregar lista
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateMenu = async (menuId, updateData) => {
    try {
      const { data, error } = await database.updateMenu(menuId, updateData)
      if (error) throw error
      await loadMenus() // Recarregar lista
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteMenu = async (menuId) => {
    try {
      const { error } = await database.deleteMenu(menuId)
      if (error) throw error
      await loadMenus() // Recarregar lista
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    menus,
    loading,
    error,
    createMenu,
    updateMenu,
    deleteMenu,
    refetch: loadMenus
  }
}

// Hook para gerenciar itens do cardápio
export function useMenuItems(menuId) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (menuId) {
      loadItems()
    }
  }, [menuId])

  const loadItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await database.getMenuItems(menuId)
      if (error) throw error
      setItems(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createItem = async (itemData) => {
    try {
      const { data, error } = await database.createMenuItem({
        ...itemData,
        menu_id: menuId
      })
      if (error) throw error
      await loadItems() // Recarregar lista
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateItem = async (itemId, updateData) => {
    try {
      const { data, error } = await database.updateMenuItem(itemId, updateData)
      if (error) throw error
      await loadItems() // Recarregar lista
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteItem = async (itemId) => {
    try {
      const { error } = await database.deleteMenuItem(itemId)
      if (error) throw error
      await loadItems() // Recarregar lista
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refetch: loadItems
  }
}

// Hook para gerenciar campanhas (Sprint 3)
export function useCampaigns() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadCampaigns()
    }
  }, [user])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const { data, error } = await database.getCampaigns(user.id)
      if (error) throw error
      setCampaigns(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createCampaign = async (campaignData) => {
    try {
      const { data, error } = await database.createCampaign({
        ...campaignData,
        restaurant_id: user.id
      })
      if (error) throw error
      await loadCampaigns() // Recarregar lista
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    campaigns,
    loading,
    error,
    createCampaign,
    refetch: loadCampaigns
  }
}

// Hook para gerenciar assinatura (Sprint 3)
export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadSubscription()
    }
  }, [user])

  const loadSubscription = async () => {
    try {
      setLoading(true)
      const { data, error } = await database.getSubscription(user.id)
      if (error && error.code !== 'PGRST116') throw error // Ignorar erro de "não encontrado"
      setSubscription(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    subscription,
    loading,
    error,
    refetch: loadSubscription
  }
}