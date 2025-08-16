import React, { useState } from 'react'
import { useMenus, useMenuItems } from '../../hooks/useData'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  MoreVertical,
  Image as ImageIcon,
  DollarSign
} from 'lucide-react'

export default function MenuManager() {
  const { menus, loading: menusLoading, createMenu, updateMenu, deleteMenu } = useMenus()
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const filteredMenus = menus.filter(menu => {
    const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || menu.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'entrada', 'prato-principal', 'sobremesa', 'bebida', 'promocao']
  const categoryLabels = {
    all: 'Todos',
    entrada: 'Entradas',
    'prato-principal': 'Pratos Principais',
    sobremesa: 'Sobremesas',
    bebida: 'Bebidas',
    promocao: 'Promoções'
  }

  const handleCreateMenu = async (menuData) => {
    try {
      await createMenu(menuData)
      setShowCreateModal(false)
    } catch (error) {
      console.error('Erro ao criar cardápio:', error)
    }
  }

  const handleUpdateMenu = async (menuData) => {
    try {
      await updateMenu(selectedMenu.id, menuData)
      setShowEditModal(false)
      setSelectedMenu(null)
    } catch (error) {
      console.error('Erro ao atualizar cardápio:', error)
    }
  }

  const handleDeleteMenu = async (menuId) => {
    if (window.confirm('Tem certeza que deseja excluir este cardápio?')) {
      try {
        await deleteMenu(menuId)
      } catch (error) {
        console.error('Erro ao excluir cardápio:', error)
      }
    }
  }

  const toggleMenuStatus = async (menu) => {
    try {
      await updateMenu(menu.id, { is_active: !menu.is_active })
    } catch (error) {
      console.error('Erro ao alterar status do cardápio:', error)
    }
  }

  if (menusLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Cardápios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os cardápios do seu restaurante
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cardápio
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar cardápios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {categoryLabels[category]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Menus Grid */}
      {filteredMenus.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cardápio encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterCategory !== 'all'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando seu primeiro cardápio.'}
          </p>
          {!searchTerm && filterCategory === 'all' && (
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Cardápio
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMenus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              onEdit={(menu) => {
                setSelectedMenu(menu)
                setShowEditModal(true)
              }}
              onDelete={handleDeleteMenu}
              onToggleStatus={toggleMenuStatus}
              onViewItems={(menu) => setSelectedMenu(menu)}
            />
          ))}
        </div>
      )}

      {/* Create Menu Modal */}
      {showCreateModal && (
        <MenuModal
          title="Criar Novo Cardápio"
          onSave={handleCreateMenu}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Menu Modal */}
      {showEditModal && selectedMenu && (
        <MenuModal
          title="Editar Cardápio"
          menu={selectedMenu}
          onSave={handleUpdateMenu}
          onClose={() => {
            setShowEditModal(false)
            setSelectedMenu(null)
          }}
        />
      )}

      {/* Menu Items View */}
      {selectedMenu && !showEditModal && (
        <MenuItemsView
          menu={selectedMenu}
          onClose={() => setSelectedMenu(null)}
        />
      )}
    </div>
  )
}

function MenuCard({ menu, onEdit, onDelete, onToggleStatus, onViewItems }) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="relative">
        {menu.image_url ? (
          <img
            className="h-48 w-full object-cover"
            src={menu.image_url}
            alt={menu.name}
          />
        ) : (
          <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 rounded-full bg-white shadow-sm hover:bg-gray-50"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onViewItems(menu)
                      setShowDropdown(false)
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Itens
                  </button>
                  <button
                    onClick={() => {
                      onEdit(menu)
                      setShowDropdown(false)
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onToggleStatus(menu)
                      setShowDropdown(false)
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    {menu.is_active ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Ativar
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      onDelete(menu.id)
                      setShowDropdown(false)
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            menu.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {menu.is_active ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>
      <div className="px-4 py-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {menu.name}
            </h3>
            {menu.description && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {menu.description}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span className="capitalize">{menu.category?.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center text-sm text-gray-900">
            <DollarSign className="w-4 h-4 mr-1" />
            R$ {menu.price?.toFixed(2) || '0,00'}
          </div>
        </div>
      </div>
    </div>
  )
}

function MenuModal({ title, menu, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: menu?.name || '',
    description: menu?.description || '',
    category: menu?.category || 'prato-principal',
    price: menu?.price || '',
    image_url: menu?.image_url || '',
    is_active: menu?.is_active ?? true
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({
        ...formData,
        price: parseFloat(formData.price) || 0
      })
    } catch (error) {
      console.error('Erro ao salvar cardápio:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'entrada', label: 'Entrada' },
    { value: 'prato-principal', label: 'Prato Principal' },
    { value: 'sobremesa', label: 'Sobremesa' },
    { value: 'bebida', label: 'Bebida' },
    { value: 'promocao', label: 'Promoção' }
  ]

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoria *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL da Imagem
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Cardápio ativo
              </label>
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

function MenuItemsView({ menu, onClose }) {
  const { menuItems, loading, createMenuItem, updateMenuItem, deleteMenuItem } = useMenuItems(menu.id)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Itens do Cardápio: {menu.name}
            </h3>
            <p className="text-sm text-gray-500">
              Gerencie os itens deste cardápio
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Novo Item
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Fechar
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum item encontrado neste cardápio.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Adicionar Primeiro Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Excluir este item?')) {
                          deleteMenuItem(item.id)
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    R$ {item.price?.toFixed(2)}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.is_available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.is_available ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Item Modal */}
        {showCreateModal && (
          <MenuItemModal
            title="Novo Item"
            onSave={async (itemData) => {
              await createMenuItem(itemData)
              setShowCreateModal(false)
            }}
            onClose={() => setShowCreateModal(false)}
          />
        )}

        {/* Edit Item Modal */}
        {editingItem && (
          <MenuItemModal
            title="Editar Item"
            item={editingItem}
            onSave={async (itemData) => {
              await updateMenuItem(editingItem.id, itemData)
              setEditingItem(null)
            }}
            onClose={() => setEditingItem(null)}
          />
        )}
      </div>
    </div>
  )
}

function MenuItemModal({ title, item, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    image_url: item?.image_url || '',
    is_available: item?.is_available ?? true
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({
        ...formData,
        price: parseFloat(formData.price) || 0
      })
    } catch (error) {
      console.error('Erro ao salvar item:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preço (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL da Imagem
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Item disponível
              </label>
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