import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useRestaurant } from '../../hooks/useData'
import {
  Menu,
  X,
  Home,
  BookOpen,
  Megaphone,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  User,
  Bell
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Cardápios', href: '/menus', icon: BookOpen },
  { name: 'Campanhas', href: '/campaigns', icon: Megaphone },
  { name: 'Landing Pages', href: '/landing-pages', icon: FileText },
  { name: 'Assinatura', href: '/billing', icon: CreditCard },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { restaurant } = useRestaurant()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar para mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent restaurant={restaurant} onSignOut={handleSignOut} />
          </div>
        </div>
      )}

      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent restaurant={restaurant} onSignOut={handleSignOut} />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="flex items-center h-16">
                    <h1 className="text-lg font-semibold text-gray-900">
                      {restaurant?.name || 'Carregando...'}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notificações */}
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Bell className="h-6 w-6" />
              </button>
              
              {/* Menu do usuário */}
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="bg-blue-600 rounded-full p-2">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo da página */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ restaurant, onSignOut }) {
  const currentPath = window.location.pathname

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-600">
        <div className="flex items-center">
          <div className="bg-white rounded-lg p-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <span className="ml-2 text-white font-bold text-lg">
            MenuAds
          </span>
        </div>
      </div>

      {/* Informações do restaurante */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-900">
          {restaurant?.name || 'Carregando...'}
        </div>
        <div className="text-xs text-gray-500">
          Plano: Básico
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = currentPath === item.href
          return (
            <a
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${
                  isActive
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 flex-shrink-0 h-6 w-6
                  ${
                    isActive
                      ? 'text-blue-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }
                `}
              />
              {item.name}
            </a>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="flex-shrink-0 px-2 py-4 border-t border-gray-200">
        <button
          onClick={onSignOut}
          className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
          Sair
        </button>
      </div>
    </div>
  )
}