import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Star, RefreshCw, Phone, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

// Mock data for user bookings
const mockBookings = [
  {
    id: '1',
    date: '2024-03-15',
    time: '10:00',
    service: 'Halı Yıkama',
    address: 'Nişantaşı Mah. Teşvikiye Cad. No:123 Şişli/İstanbul',
    status: 'completed',
    rating: 5,
    technician: 'Mehmet Yılmaz'
  },
  {
    id: '2',
    date: '2024-03-20',
    time: '14:00',
    service: 'Koltuk Yıkama',
    address: 'Nişantaşı Mah. Teşvikiye Cad. No:123 Şişli/İstanbul',
    status: 'upcoming',
    technician: 'Ayşe Demir'
  },
  {
    id: '3',
    date: '2024-02-28',
    time: '11:30',
    service: 'Stor ve Perde Yıkama',
    address: 'Nişantaşı Mah. Teşvikiye Cad. No:123 Şişli/İstanbul',
    status: 'completed',
    rating: 5,
    technician: 'Fatma Kaya'
  }
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Initialize profile data when user changes
  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveProfile = () => {
    // Here you would typically update the user in your auth context
    // For now, we'll just show a success message
    alert('Profil bilgileri güncellendi!');
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset to original user data
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Panelinizi görüntülemek için lütfen giriş yapın</h2>
          <Button onClick={() => window.location.href = '/giris'}>
            Giriş Yap
          </Button>
        </div>
      </div>
    );
  }

  const upcomingBookings = mockBookings.filter(booking => booking.status === 'upcoming');
  const completedBookings = mockBookings.filter(booking => booking.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tekrar hoş geldiniz, {user.name}!
              </h1>
              <p className="text-gray-600">Temizlik hizmetlerinizi ve hesabınızı yönetin</p>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="text-gray-600 hover:text-gray-800"
            >
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'bookings', label: 'Rezervasyonlarım', icon: Calendar },
                  { id: 'profile', label: 'Profil', icon: Star },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Toplam Rezervasyon</p>
                        <p className="text-2xl font-bold text-gray-900">{mockBookings.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Star className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Ortalama Puan</p>
                        <p className="text-2xl font-bold text-gray-900">5.0</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Sonraki Hizmet</p>
                        <p className="text-lg font-bold text-gray-900">20 Mar</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Bookings */}
                {upcomingBookings.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Yaklaşan Hizmetler</h2>
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{booking.service}</h3>
                              <div className="flex items-center text-gray-600 mt-1">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span className="text-sm">{booking.date} saat {booking.time}</span>
                              </div>
                              <div className="flex items-center text-gray-600 mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="text-sm">{booking.address}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Teknisyen: {booking.technician}</div>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <Button size="sm" className="flex items-center">
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Yeniden Planla
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              Ara
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Mesaj
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service History */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Hizmet Geçmişi</h2>
                  <div className="space-y-4">
                    {completedBookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{booking.service}</h3>
                            <div className="flex items-center text-gray-600 mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span className="text-sm">{booking.date} saat {booking.time}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{booking.address}</span>
                            </div>
                            {booking.rating && (
                              <div className="flex items-center mt-2">
                                <div className="flex items-center">
                                  {[...Array(booking.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600 ml-2">Verdiğiniz puan</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-green-600 font-medium">Tamamlandı</div>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Button size="sm" className="flex items-center">
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Tekrar Rezerve Et
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Değerlendirme Yap
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profil Bilgileri</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors ${
                        isEditing ? 'bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors ${
                        isEditing ? 'bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors ${
                        isEditing ? 'bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors ${
                        isEditing ? 'bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                  
                  {/* Edit/Save/Cancel Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {!isEditing ? (
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="w-full sm:w-auto"
                      >
                        Profili Düzenle
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={handleSaveProfile}
                          className="w-full sm:w-auto"
                        >
                          Değişiklikleri Kaydet
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="w-full sm:w-auto"
                        >
                          İptal
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;