import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, User, Phone, Mail, MapPin, Clock, MessageCircle, AlertCircle } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import Button from '../components/common/Button';

const Booking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { services, currentTicket, updateTicket } = useBooking();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceIds: location.state?.selectedService ? [location.state.selectedService] : [],
    name: '',
    phone: '',
    email: '',
    address: '',
    preferredTime: '',
    area: '',
    specialInstructions: '',
    urgency: 'normal' as 'normal' | 'urgent' | 'emergency'
  });

  const preferredTimes = [
    'Sabah (08:00 - 12:00)',
    'Öğleden Sonra (12:00 - 17:00)',
    'Akşam (17:00 - 21:00)',
    'Esnek (Herhangi bir zaman)',
    'Hafta Sonu Tercihi'
  ];

  const urgencyLevels = [
    { value: 'normal', label: 'Normal', description: '2-3 gün içinde', color: 'text-blue-600' },
    { value: 'urgent', label: 'Acil', description: '24 saat içinde', color: 'text-orange-600' },
    { value: 'emergency', label: 'Acil Durum', description: 'Aynı gün', color: 'text-red-600' }
  ];

  const steps = [
    { id: 1, title: 'Hizmet Seçimi', icon: CheckCircle },
    { id: 2, title: 'İletişim Bilgileri', icon: User },
    { id: 3, title: 'Hizmet Detayları', icon: MapPin },
    { id: 4, title: 'Rezervasyon Özeti', icon: MessageCircle }
  ];

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter(id => id !== serviceId)
        : [...prev.serviceIds, serviceId]
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

const handleSubmit = async () => {
  const payload = {
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    preferredTime: formData.preferredTime,
    area: formData.area,
    specialInstructions: formData.specialInstructions,
    urgency: formData.urgency,
    services: selectedServices.map(s => s.name).join(', ')
  };

  try {
    const response = await fetch('https://formspree.io/f/xeozqdad', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      // ✅ Bu senin önceki işlemlerin
      updateTicket({
        serviceIds: formData.serviceIds,
        contactInfo: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address
        },
        preferredTime: formData.preferredTime,
        area: formData.area,
        specialInstructions: formData.specialInstructions,
        urgency: formData.urgency
      });

      alert('Rezervasyonunuz başarıyla gönderildi! 2 saat içinde size geri döneceğiz.');
      navigate('/');
    } else {
      alert('Form gönderilemedi. Lütfen tekrar deneyin.');
    }
  } catch (error) {
    alert('Sunucuya bağlanılamadı.');
    console.error(error);
  }
};
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.serviceIds.length > 0;
      case 2:
        return formData.name && formData.phone && formData.email;
      case 3:
        return formData.address && formData.preferredTime;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const selectedServices = services.filter(service => formData.serviceIds.includes(service.id));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hizmet Rezervasyonu</h1>
          <p className="text-xl text-gray-600">Temizlik ihtiyacınızı belirtin, size en kısa sürede dönelim</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-primary-600 border-primary-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      Adım {step.id}
                    </p>
                    <p className={`text-sm ${
                      isActive ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-16 h-0.5 ml-6 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {/* Step 1: Select Services */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Hangi hizmetlere ihtiyacınız var?</h2>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          formData.serviceIds.includes(service.id)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleServiceToggle(service.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                            <p className="text-gray-600 text-sm">{service.description}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            formData.serviceIds.includes(service.id)
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.serviceIds.includes(service.id) && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Bilgileriniz</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Soyad *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Adınızı ve soyadınızı girin"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon Numarası *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Telefon numaranızı girin"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta Adresi *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="E-posta adresinizi girin"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Service Details */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Hizmet Detayları</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hizmet Adresi *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Adresinizi girin"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tercih Edilen Zaman *
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {preferredTimes.map((time) => (
                          <button
                            key={time}
                            onClick={() => setFormData(prev => ({ ...prev, preferredTime: time }))}
                            className={`px-4 py-3 rounded-lg border text-left font-medium transition-all duration-200 ${
                              formData.preferredTime === time
                                ? 'border-primary-500 bg-primary-500 text-white'
                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aciliyet Durumu
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {urgencyLevels.map((level) => (
                          <button
                            key={level.value}
                            onClick={() => setFormData(prev => ({ ...prev, urgency: level.value as any }))}
                            className={`px-4 py-3 rounded-lg border text-left transition-all duration-200 ${
                              formData.urgency === level.value
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className={`font-medium ${level.color}`}>{level.label}</div>
                                <div className="text-sm text-gray-600">{level.description}</div>
                              </div>
                              {level.value === 'emergency' && (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alan Büyüklüğü (Tahmini)
                      </label>
                      <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                        placeholder="Örn: 20 m², 3 koltuk, 2 perde vs."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Özel Talimatlar (İsteğe Bağlı)
                      </label>
                      <textarea
                        value={formData.specialInstructions}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                        rows={4}
                        placeholder="Leke türleri, dikkat edilmesi gereken alanlar, evcil hayvan varlığı vs."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Summary */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Rezervasyon Özeti</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Seçilen Hizmetler:</h3>
                      <ul className="space-y-2">
                        {selectedServices.map((service) => (
                          <li key={service.id} className="flex items-center text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {service.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">İletişim Bilgileri:</h3>
                      <div className="space-y-2 text-gray-700">
                        <p><strong>Ad Soyad:</strong> {formData.name}</p>
                        <p><strong>Telefon:</strong> {formData.phone}</p>
                        <p><strong>E-posta:</strong> {formData.email}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Hizmet Detayları:</h3>
                      <div className="space-y-2 text-gray-700">
                        <p><strong>Adres:</strong> {formData.address}</p>
                        <p><strong>Tercih Edilen Zaman:</strong> {formData.preferredTime}</p>
                        <p><strong>Aciliyet:</strong> {urgencyLevels.find(l => l.value === formData.urgency)?.label}</p>
                        {formData.area && <p><strong>Alan:</strong> {formData.area}</p>}
                        {formData.specialInstructions && (
                          <p><strong>Özel Talimatlar:</strong> {formData.specialInstructions}</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Sonraki Adım:</strong> Rezervasyonunuzu gönderdikten sonra, uzmanlarımız 2 saat içinde 
                        sizinle iletişime geçerek detayları konuşacak ve randevu planlayacaktır.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Önceki
                </Button>
                {currentStep < 4 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                  >
                    Sonraki
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid()}
                  >
                    Rezervasyonu Gönder
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rezervasyon Özeti</h3>
              
              {selectedServices.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Seçilen Hizmetler:</h4>
                    {selectedServices.map((service) => (
                      <div key={service.id} className="text-sm text-gray-600 mb-1">
                        • {service.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.name && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">İletişim:</h4>
                  <div className="text-sm text-gray-600">
                    <p>{formData.name}</p>
                    {formData.phone && <p>{formData.phone}</p>}
                  </div>
                </div>
              )}

              {formData.preferredTime && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Tercih Edilen Zaman:</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{formData.preferredTime}</span>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-4 text-white text-center">
                  <h4 className="font-bold mb-2">Hızlı Yanıt!</h4>
                  <p className="text-primary-100 text-sm">
                    Uzmanlarımız 2 saat içinde sizinle iletişime geçecek.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;