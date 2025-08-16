import React, { useState } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  ExternalLink,
  Save,
  X,
  Image,
  Type,
  Layout,
  Palette,
  Settings,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'

export default function LandingPageBuilder() {
  const [pages, setPages] = useState([
    {
      id: 1,
      name: 'Promoção Pizza Margherita',
      url: 'pizza-margherita-promo',
      status: 'published',
      views: 1250,
      conversions: 89,
      created_at: '2024-01-15',
      template: 'restaurant-promo'
    },
    {
      id: 2,
      name: 'Menu Completo',
      url: 'menu-completo',
      status: 'draft',
      views: 0,
      conversions: 0,
      created_at: '2024-01-20',
      template: 'full-menu'
    }
  ])
  
  const [showModal, setShowModal] = useState(false)
  const [editingPage, setEditingPage] = useState(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const [selectedPage, setSelectedPage] = useState(null)

  const templates = [
    {
      id: 'restaurant-promo',
      name: 'Promoção de Restaurante',
      description: 'Template para promoções e ofertas especiais',
      preview: '/templates/restaurant-promo.jpg'
    },
    {
      id: 'full-menu',
      name: 'Menu Completo',
      description: 'Exibe todo o cardápio do restaurante',
      preview: '/templates/full-menu.jpg'
    },
    {
      id: 'delivery-special',
      name: 'Especial Delivery',
      description: 'Focado em pedidos de entrega',
      preview: '/templates/delivery-special.jpg'
    }
  ]

  const handleCreatePage = () => {
    setEditingPage(null)
    setShowModal(true)
  }

  const handleEditPage = (page) => {
    setEditingPage(page)
    setShowModal(true)
  }

  const handleDeletePage = (pageId) => {
    if (window.confirm('Tem certeza que deseja excluir esta landing page?')) {
      setPages(pages.filter(p => p.id !== pageId))
    }
  }

  const handleDuplicatePage = (page) => {
    const newPage = {
      ...page,
      id: Date.now(),
      name: `${page.name} (Cópia)`,
      url: `${page.url}-copy`,
      status: 'draft',
      views: 0,
      conversions: 0,
      created_at: new Date().toISOString().split('T')[0]
    }
    setPages([...pages, newPage])
  }

  const handleOpenBuilder = (page) => {
    setSelectedPage(page)
    setShowBuilder(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Landing Pages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Crie páginas de destino para suas campanhas de marketing
          </p>
        </div>
        <button
          onClick={handleCreatePage}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Landing Page
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Layout className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Páginas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pages.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Visualizações
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pages.reduce((sum, page) => sum + page.views, 0).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExternalLink className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Conversões
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pages.reduce((sum, page) => sum + page.conversions, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Suas Landing Pages
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {pages.map((page) => (
            <li key={page.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Layout className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {page.name}
                      </p>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        page.status === 'published' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {page.status === 'published' ? 'Publicada' : 'Rascunho'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      /{page.url}
                    </p>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Eye className="w-4 h-4 mr-1" />
                      {page.views.toLocaleString()} visualizações
                      <span className="mx-2">•</span>
                      {page.conversions} conversões
                      <span className="mx-2">•</span>
                      Criada em {new Date(page.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenBuilder(page)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    title="Editar no Builder"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(`/landing/${page.url}`, '_blank')}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicatePage(page)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditPage(page)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    title="Configurações"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePage(page.id)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-red-700 bg-white hover:bg-red-50"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <PageModal
          page={editingPage}
          templates={templates}
          onClose={() => setShowModal(false)}
          onSave={(pageData) => {
            if (editingPage) {
              setPages(pages.map(p => p.id === editingPage.id ? { ...p, ...pageData } : p))
            } else {
              const newPage = {
                id: Date.now(),
                ...pageData,
                views: 0,
                conversions: 0,
                created_at: new Date().toISOString().split('T')[0]
              }
              setPages([...pages, newPage])
            }
            setShowModal(false)
          }}
        />
      )}

      {/* Page Builder */}
      {showBuilder && selectedPage && (
        <PageBuilder
          page={selectedPage}
          onClose={() => setShowBuilder(false)}
          onSave={(pageData) => {
            setPages(pages.map(p => p.id === selectedPage.id ? { ...p, ...pageData } : p))
            setShowBuilder(false)
          }}
        />
      )}
    </div>
  )
}

function PageModal({ page, templates, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: page?.name || '',
    url: page?.url || '',
    template: page?.template || templates[0]?.id || '',
    status: page?.status || 'draft'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {page ? 'Editar Landing Page' : 'Nova Landing Page'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome da Página
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL (slug)
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                /landing/
              </span>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Template
            </label>
            <select
              value={formData.template}
              onChange={(e) => setFormData({ ...formData, template: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
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
              <option value="draft">Rascunho</option>
              <option value="published">Publicada</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {page ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PageBuilder({ page, onClose, onSave }) {
  const [activeDevice, setActiveDevice] = useState('desktop')
  const [activePanel, setActivePanel] = useState('content')
  const [pageContent, setPageContent] = useState({
    title: 'Título da Página',
    subtitle: 'Subtítulo atrativo',
    description: 'Descrição detalhada da oferta ou produto',
    buttonText: 'Peça Agora',
    buttonLink: '#',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#3b82f6',
    images: []
  })

  const devices = [
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
    { id: 'tablet', icon: Tablet, label: 'Tablet' },
    { id: 'mobile', icon: Smartphone, label: 'Mobile' }
  ]

  const panels = [
    { id: 'content', icon: Type, label: 'Conteúdo' },
    { id: 'design', icon: Palette, label: 'Design' },
    { id: 'images', icon: Image, label: 'Imagens' },
    { id: 'settings', icon: Settings, label: 'Configurações' }
  ]

  const handleSave = () => {
    onSave({ content: pageContent })
  }

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-medium">{page.name}</h2>
          <div className="flex items-center space-x-2">
            {devices.map((device) => {
              const Icon = device.icon
              return (
                <button
                  key={device.id}
                  onClick={() => setActiveDevice(device.id)}
                  className={`p-2 rounded ${
                    activeDevice === device.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  title={device.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800"
          >
            <X className="w-4 h-4 mr-2" />
            Fechar
          </button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          {/* Panel Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {panels.map((panel) => {
                const Icon = panel.icon
                return (
                  <button
                    key={panel.id}
                    onClick={() => setActivePanel(panel.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activePanel === panel.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {panel.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Panel Content */}
          <div className="p-6">
            {activePanel === 'content' && (
              <ContentPanel 
                content={pageContent}
                onChange={setPageContent}
              />
            )}
            {activePanel === 'design' && (
              <DesignPanel 
                content={pageContent}
                onChange={setPageContent}
              />
            )}
            {activePanel === 'images' && (
              <ImagesPanel 
                content={pageContent}
                onChange={setPageContent}
              />
            )}
            {activePanel === 'settings' && (
              <SettingsPanel 
                page={page}
                content={pageContent}
                onChange={setPageContent}
              />
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 bg-gray-100 overflow-auto">
          <div className="p-8">
            <div className={`mx-auto bg-white shadow-lg rounded-lg overflow-hidden ${
              activeDevice === 'mobile' ? 'max-w-sm' :
              activeDevice === 'tablet' ? 'max-w-2xl' : 'max-w-4xl'
            }`}>
              <PagePreview content={pageContent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContentPanel({ content, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título Principal
        </label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtítulo
        </label>
        <input
          type="text"
          value={content.subtitle}
          onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          value={content.description}
          onChange={(e) => onChange({ ...content, description: e.target.value })}
          rows={4}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Texto do Botão
        </label>
        <input
          type="text"
          value={content.buttonText}
          onChange={(e) => onChange({ ...content, buttonText: e.target.value })}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Link do Botão
        </label>
        <input
          type="url"
          value={content.buttonLink}
          onChange={(e) => onChange({ ...content, buttonLink: e.target.value })}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  )
}

function DesignPanel({ content, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cor de Fundo
        </label>
        <input
          type="color"
          value={content.backgroundColor}
          onChange={(e) => onChange({ ...content, backgroundColor: e.target.value })}
          className="w-full h-10 border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cor do Texto
        </label>
        <input
          type="color"
          value={content.textColor}
          onChange={(e) => onChange({ ...content, textColor: e.target.value })}
          className="w-full h-10 border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cor de Destaque
        </label>
        <input
          type="color"
          value={content.accentColor}
          onChange={(e) => onChange({ ...content, accentColor: e.target.value })}
          className="w-full h-10 border-gray-300 rounded-md"
        />
      </div>
    </div>
  )
}

function ImagesPanel({ content, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adicionar Imagem
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Selecionar Imagem
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            PNG, JPG, GIF até 10MB
          </p>
        </div>
      </div>
    </div>
  )
}

function SettingsPanel({ page, content, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">SEO</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <input
              type="text"
              className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Título para SEO"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              rows={2}
              className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descrição para SEO"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Analytics</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Google Analytics ID
            </label>
            <input
              type="text"
              className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="GA-XXXXXXXXX-X"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Facebook Pixel ID
            </label>
            <input
              type="text"
              className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="123456789012345"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function PagePreview({ content }) {
  return (
    <div 
      className="min-h-screen p-8"
      style={{ 
        backgroundColor: content.backgroundColor,
        color: content.textColor 
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          {content.title}
        </h1>
        <h2 className="text-xl mb-6 opacity-80">
          {content.subtitle}
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          {content.description}
        </p>
        <button 
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-sm hover:opacity-90"
          style={{ backgroundColor: content.accentColor }}
        >
          {content.buttonText}
        </button>
      </div>
    </div>
  )
}