import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useRestaurant } from '../../hooks/useData'
import { ChevronRight, ChevronLeft, Check, MapPin, Phone, Globe, Clock } from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Informações Básicas', description: 'Dados do seu restaurante' },
  { id: 2, title: 'Localização', description: 'Endereço e contato' },
  { id: 3, title: 'Configurações', description: 'Horários e preferências' },
  { id: 4, title: 'Finalização', description: 'Revisar e confirmar' }
]

export default function OnboardingFlow({ onComplete }) {
  const { user } = useAuth()
  const { updateRestaurant } = useRestaurant()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine_type: '',
    phone: '',
    email: user?.email || '',
    website: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    opening_hours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '22:00', closed: false },
      saturday: { open: '09:00', close: '22:00', closed: false },
      sunday: { open: '09:00', close: '22:00', closed: true }
    },
    delivery_fee: 5.00,
    minimum_order: 25.00,
    accepts_cards: true,
    accepts_pix: true,
    accepts_cash: true
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [day]: {
          ...prev.opening_hours[day],
          [field]: value
        }
      }
    }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await updateRestaurant(formData)
      onComplete?.()
    } catch (error) {
      console.error('Erro ao salvar dados do restaurante:', error)
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.cuisine_type
      case 2:
        return formData.phone && formData.address && formData.city
      case 3:
        return true
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Configure seu Restaurante
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Vamos configurar as informações básicas do seu negócio
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep > step.id
                    ? 'bg-green-500 border-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 ml-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">
              {STEPS[currentStep - 1].title}
            </h3>
            <p className="text-sm text-gray-500">
              {STEPS[currentStep - 1].description}
            </p>
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Step 1: Informações Básicas */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Restaurante *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Pizzaria do João"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descreva seu restaurante..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Culinária *
                </label>
                <select
                  value={formData.cuisine_type}
                  onChange={(e) => handleInputChange('cuisine_type', e.target.value)}
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
          )}

          {/* Step 2: Localização */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(11) 99999-9999"
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
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://seusite.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Endereço *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Rua, número, bairro"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
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
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SP"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Configurações */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  <Clock className="inline w-5 h-5 mr-2" />
                  Horários de Funcionamento
                </h4>
                <div className="space-y-3">
                  {Object.entries(formData.opening_hours).map(([day, hours]) => {
                    const dayNames = {
                      monday: 'Segunda-feira',
                      tuesday: 'Terça-feira',
                      wednesday: 'Quarta-feira',
                      thursday: 'Quinta-feira',
                      friday: 'Sexta-feira',
                      saturday: 'Sábado',
                      sunday: 'Domingo'
                    }

                    return (
                      <div key={day} className="flex items-center space-x-4">
                        <div className="w-24">
                          <span className="text-sm font-medium text-gray-700">
                            {dayNames[day]}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={!hours.closed}
                            onChange={(e) => handleHoursChange(day, 'closed', !e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          {!hours.closed && (
                            <>
                              <input
                                type="time"
                                value={hours.open}
                                onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                                className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              />
                              <span className="text-gray-500">às</span>
                              <input
                                type="time"
                                value={hours.close}
                                onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                                className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              />
                            </>
                          )}
                          {hours.closed && (
                            <span className="text-gray-500 text-sm">Fechado</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
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
                    onChange={(e) => handleInputChange('delivery_fee', parseFloat(e.target.value))}
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
                    onChange={(e) => handleInputChange('minimum_order', parseFloat(e.target.value))}
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
                      onChange={(e) => handleInputChange('accepts_cards', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Cartões (Débito/Crédito)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.accepts_pix}
                      onChange={(e) => handleInputChange('accepts_pix', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">PIX</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.accepts_cash}
                      onChange={(e) => handleInputChange('accepts_cash', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Dinheiro</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Finalização */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Quase pronto!
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Revise as informações e finalize a configuração do seu restaurante.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Resumo:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Nome:</strong> {formData.name}</p>
                  <p><strong>Tipo:</strong> {formData.cuisine_type}</p>
                  <p><strong>Telefone:</strong> {formData.phone}</p>
                  <p><strong>Cidade:</strong> {formData.city}</p>
                  <p><strong>Taxa de entrega:</strong> R$ {formData.delivery_fee?.toFixed(2)}</p>
                  <p><strong>Pedido mínimo:</strong> R$ {formData.minimum_order?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isStepValid()
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
              >
                Próximo
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Finalizar Configuração'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}