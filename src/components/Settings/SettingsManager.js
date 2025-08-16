import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useRestaurant } from '../../hooks/useData'
import {
  User,
  MapPin,
  Phone,
  Globe,
  Clock,
  CreditCard,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  Check
} from 'lucide-react'

export default function SettingsManager() {
  const { user, signOut } = useAuth()
  const { restaurant, updateRestaurant, loading: restaurantLoading } = useRestaurant()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'restaurant', label: 'Restaurante', icon: MapPin },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield }
  ]

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie suas configurações pessoais e do restaurante
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`rounded-md p-4 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <Check className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <ProfileSettings 
              user={user} 
              onSave={showMessage}
              saving={saving}
              setSaving={setSaving}
            />
          )}
          {activeTab === 'restaurant' && (
            <RestaurantSettings 
              restaurant={restaurant}
              updateRestaurant={updateRestaurant}
              loading={restaurantLoading}
              onSave={showMessage}
              saving={saving}
              setSaving={setSaving}
            />
          )}
          {activeTab === 'notifications' && (
            <NotificationSettings 
              onSave={showMessage}
              saving={saving}
              setSaving={setSaving}
            />
          )}
          {activeTab === 'security' && (
            <SecuritySettings 
              user={user}
              signOut={signOut}
              onSave={showMessage}
              saving={saving}
              setSaving={setSaving}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileSettings({ user, onSave, saving, setSaving }) {
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    avatar_url: user?.user_metadata?.avatar_url || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Aqui seria a chamada para atualizar o perfil do usuário
      // await updateProfile(formData)
      onSave('success', 'Perfil atualizado com sucesso!')
    } catch (error) {
      onSave('error', 'Erro ao atualizar perfil. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Informações Pessoais</h3>
        <p className="mt-1 text-sm text-gray-500">
          Atualize suas informações pessoais e de contato.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome Completo
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled
          />
          <p className="mt-1 text-xs text-gray-500">
            Para alterar o email, entre em contato com o suporte.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            URL do Avatar
          </label>
          <input
            type="url"
            value={formData.avatar_url}
            onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://exemplo.com/avatar.jpg"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  )
}

function RestaurantSettings({ restaurant, updateRestaurant, loading, onSave, saving, setSaving }) {
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    description: restaurant?.description || '',
    cuisine_type: restaurant?.cuisine_type || '',
    phone: restaurant?.phone || '',
    website: restaurant?.website || '',
    address: restaurant?.address || '',
    city: restaurant?.city || '',
    state: restaurant?.state || '',
    zip_code: restaurant?.zip_code || '',
    delivery_fee: restaurant?.delivery_fee || 0,
    minimum_order: restaurant?.minimum_order || 0,
    accepts_cards: restaurant?.accepts_cards ?? true,
    accepts_pix: restaurant?.accepts_pix ?? true,
    accepts_cash: restaurant?.accepts_cash ?? true
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateRestaurant(formData)
      onSave('success', 'Informações do restaurante atualizadas com sucesso!')
    } catch (error) {
      onSave('error', 'Erro ao atualizar informações. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Informações do Restaurante</h3>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie as informações básicas do seu restaurante.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome do Restaurante
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Culinária
          </label>
          <select
            value={formData.cuisine_type}
            onChange={(e) => setFormData({ ...formData, cuisine_type: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione...</option>
            <option value="brasileira">Brasileira</option>
            <option value="italiana">Italiana</option>
            <option value="japonesa">Japonesa</option>
            <option value="mexicana">Mexicana</option>
            <option value="pizza">Pizza</option>
            <option value="hamburguer">Hambúrguer</option>
            <option value="saudavel">Saudável</option>
            <option value="vegetariana">Vegetariana</option>
            <option value="doces">Doces e Sobremesas</option>
            <option value="outros">Outros</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Descreva seu restaurante..."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            <Phone className="inline w-4 h-4 mr-1" />
            Telefone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <Globe className="inline w-4 h-4 mr-1" />
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="inline w-4 h-4 mr-1" />
          Endereço
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Cidade
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Taxa de Entrega (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.delivery_fee}
            onChange={(e) => setFormData({ ...formData, delivery_fee: parseFloat(e.target.value) })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pedido Mínimo (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.minimum_order}
            onChange={(e) => setFormData({ ...formData, minimum_order: parseFloat(e.target.value) })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Formas de Pagamento Aceitas
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.accepts_cards}
              onChange={(e) => setFormData({ ...formData, accepts_cards: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Cartões (Débito/Crédito)</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.accepts_pix}
              onChange={(e) => setFormData({ ...formData, accepts_pix: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">PIX</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.accepts_cash}
              onChange={(e) => setFormData({ ...formData, accepts_cash: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Dinheiro</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  )
}

function NotificationSettings({ onSave, saving, setSaving }) {
  const [settings, setSettings] = useState({
    email_campaigns: true,
    email_billing: true,
    email_updates: false,
    push_campaigns: true,
    push_orders: true,
    push_billing: true,
    sms_campaigns: false,
    sms_billing: true
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Aqui seria a chamada para salvar as configurações de notificação
      // await updateNotificationSettings(settings)
      onSave('success', 'Configurações de notificação atualizadas!')
    } catch (error) {
      onSave('error', 'Erro ao atualizar configurações. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Preferências de Notificação</h3>
        <p className="mt-1 text-sm text-gray-500">
          Escolha como e quando você quer receber notificações.
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">Notificações por Email</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Campanhas e Marketing</span>
                <p className="text-sm text-gray-500">Receba atualizações sobre suas campanhas</p>
              </div>
              <input
                type="checkbox"
                checked={settings.email_campaigns}
                onChange={(e) => setSettings({ ...settings, email_campaigns: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Cobrança e Pagamentos</span>
                <p className="text-sm text-gray-500">Faturas, cobranças e atualizações de pagamento</p>
              </div>
              <input
                type="checkbox"
                checked={settings.email_billing}
                onChange={(e) => setSettings({ ...settings, email_billing: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Atualizações do Produto</span>
                <p className="text-sm text-gray-500">Novos recursos e melhorias</p>
              </div>
              <input
                type="checkbox"
                checked={settings.email_updates}
                onChange={(e) => setSettings({ ...settings, email_updates: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">Notificações Push</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Campanhas</span>
                <p className="text-sm text-gray-500">Alertas sobre performance das campanhas</p>
              </div>
              <input
                type="checkbox"
                checked={settings.push_campaigns}
                onChange={(e) => setSettings({ ...settings, push_campaigns: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Pedidos</span>
                <p className="text-sm text-gray-500">Novos pedidos e atualizações</p>
              </div>
              <input
                type="checkbox"
                checked={settings.push_orders}
                onChange={(e) => setSettings({ ...settings, push_orders: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Cobrança</span>
                <p className="text-sm text-gray-500">Lembretes de pagamento</p>
              </div>
              <input
                type="checkbox"
                checked={settings.push_billing}
                onChange={(e) => setSettings({ ...settings, push_billing: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* SMS Notifications */}
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">Notificações por SMS</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Campanhas Importantes</span>
                <p className="text-sm text-gray-500">Apenas alertas críticos sobre campanhas</p>
              </div>
              <input
                type="checkbox"
                checked={settings.sms_campaigns}
                onChange={(e) => setSettings({ ...settings, sms_campaigns: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Cobrança</span>
                <p className="text-sm text-gray-500">Lembretes de vencimento</p>
              </div>
              <input
                type="checkbox"
                checked={settings.sms_billing}
                onChange={(e) => setSettings({ ...settings, sms_billing: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Preferências'}
        </button>
      </div>
    </form>
  )
}

function SecuritySettings({ user, signOut, onSave, saving, setSaving }) {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      onSave('error', 'As senhas não coincidem.')
      return
    }

    if (passwordData.newPassword.length < 6) {
      onSave('error', 'A nova senha deve ter pelo menos 6 caracteres.')
      return
    }

    setSaving(true)
    try {
      // Aqui seria a chamada para alterar a senha
      // await changePassword(passwordData.currentPassword, passwordData.newPassword)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      onSave('success', 'Senha alterada com sucesso!')
    } catch (error) {
      onSave('error', 'Erro ao alterar senha. Verifique sua senha atual.')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      try {
        await signOut()
      } catch (error) {
        onSave('error', 'Erro ao fazer logout.')
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Alterar Senha</h3>
        <p className="mt-1 text-sm text-gray-500">
          Mantenha sua conta segura com uma senha forte.
        </p>
        
        <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha Atual
            </label>
            <div className="mt-1 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nova Senha
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmar Nova Senha
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Shield className="w-4 h-4 mr-2" />
              {saving ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-medium text-gray-900">Informações da Conta</h3>
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-700">Email da conta:</span>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-700">Conta criada em:</span>
              <p className="text-sm text-gray-500">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-medium text-red-900">Zona de Perigo</h3>
        <p className="mt-1 text-sm text-gray-500">
          Ações irreversíveis relacionadas à sua conta.
        </p>
        
        <div className="mt-6">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  )
}