import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import Button from '../components/common/Button';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Mesajınız için teşekkürler! 24 saat içinde size geri döneceğiz.');
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Bizi Arayın',
      details: ['(0312) 350 95 95', '7/24 Ulaşılabilir'],
      action: 'tel:+903123509595',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Mail,
      title: 'E-posta Gönderin',
      details: ['olguhaliyikama@gmail.com', '2 saat içinde yanıt'],
      action: 'mailto:olguhaliyikama@gmail.com',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: ['Hızlı sohbet desteği', 'Anında yanıtlanır'],
      action: 'https://wa.me/905332002662',
      color: 'text-emerald-600 bg-emerald-100'
    },
    {
      icon: MapPin,
      title: 'Hizmet Alanı',
      details: ['Çankaya Geneli', '10 km yarıçap'],
      action: null,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const businessHours = [
    { day: 'Pazartesi - Cuma', hours: '08:00 - 20:00' },
    { day: 'Cumartesi', hours: '09:00 - 18:00' },
    { day: 'Pazar', hours: '10:00 - 16:00' },
    { day: 'Acil Durum Hizmeti', hours: '7/24 Mevcut' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">İletişime Geçin</h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Temizlik hizmetinizi planlamaya hazır mısınız? Sorularınız, teklifleriniz 
              ve bir sonraki randevunuzu ayarlamak için buradayız.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Bize Mesaj Gönderin</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Adınızı ve soyadınızı girin"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta Adresi *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="E-posta adresinizi girin"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon Numarası
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Telefon numaranızı girin"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      İlgilendiğiniz Hizmet
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Bir hizmet seçin</option>
                      <option value="hali-temizligi">Halı Derin Temizliği</option>
                      <option value="doseme-temizligi">Döşeme Temizliği</option>
                      <option value="perde-temizligi">Perde ve Fon Temizliği</option>
                      <option value="kilim-temizligi">Kilim Temizliği</option>
                      <option value="ticari">Ticari Temizlik</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Temizlik ihtiyaçlarınız, tercih edilen tarihler veya sorularınız hakkında bize bilgi verin..."
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full md:w-auto px-8 py-3"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Mesaj Gönder
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  const content = (
                    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-12 h-12 ${info.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                        ))}
                      </div>
                    </div>
                  );

                  return info.action ? (
                    <a key={index} href={info.action} className="block">
                      {content}
                    </a>
                  ) : (
                    <div key={index}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Çalışma Saatleri</h3>
              </div>
              <div className="space-y-3">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{schedule.day}</span>
                    <span className="text-gray-600">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Emergency Service */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Acil Durum Hizmeti</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Halınıza bir şey mi döküldü? Acil temizlik mi gerekiyor? Acil durumlar için 7/24 hizmetinizdeyiz.
                </p>
                <a href="tel:+903123509595">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Acil Durum Hattını Ara
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Google Maps Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Konumumuz</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kırkkonaklar’daki şubemizi ziyaret edebilir ya da hizmet bölgemiz içerisinde belirttiğiniz adrese gelerek yerinde hizmet sağlayabiliriz.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="h-96 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.2847982842847!2d32.8547!3d39.9334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d347d520732db1%3A0x9b0b2b2b2b2b2b2b!2sK%C4%B1rkkonaklar%2C%20%C5%9Eemsettin%20G%C3%BCnaltay%20Cd.%20No%3A300%20D%3AB%2C%2006610%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1635789012345!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Olgu Temizlik Konum"
                />
              </div>
            </motion.div>

            {/* Location Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Şubemiz</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Kırkkonaklar, Şemsettin Günaltay Cd. No:300 D:B<br />
                      06610 Çankaya/Ankara
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <span>Pazartesi - Cumartesi: 08:00 - 21:30</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <a href="tel:+903123509595" className="hover:text-primary-600 transition-colors">
                      (0312) 350 95 95
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <a href="mailto:olguhaliyikama@gmail.com" className="hover:text-primary-600 transition-colors">
                      olguhaliyikama@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Service Area */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Hizmet Alanımız</h4>
                <p className="text-gray-700 mb-4">
                  Çankaya ve çevre ilçelerde profesyonel temizlik hizmetleri sunuyoruz.
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>• Birlik</div>
                  <div>• Yıldz</div>
                  <div>• Kavaklıdere</div>
                  <div>• Gaziosmanpaşa</div>
                  <div>• Bahçelievler</div>
                  <div>• Kızılay</div>
                  <div>• Nato Yolu</div>
                  <div>• Tuzluçayır</div>
                  <div>• Dikmen</div>
                  <div>• Türközü</div>
                  <div>• Aşıkpaşa</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-gray-600">Hizmetlerimiz hakkında sık sorulan soruların hızlı yanıtları</p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: 'Ne kadar hızlı hizmet planlayabilirsiniz?',
                answer: 'Acil ihtiyaçlar için aynı gün hizmet sunuyoruz ve normal rezervasyonlar için genellikle 24-48 saat içinde müsaitlik bulunmaktadır.'
              },
              {
                question: 'Halıları ne kadar sürede teslim ediyorsunuz?',
                answer: 'Halılarınız, adresinizden teslim alındıktan sonra 3 ila 5 iş günü içerisinde yıkanarak kurutulur, paketlenir ve tekrar adresinize teslim edilir. Süre; halının türü, kirlilik durumu ve hava koşullarına göre değişebilir.'
              },
              {
                question: 'Temizlik ürünleriniz evcil hayvanlar ve çocuklar için güvenli mi?',
                answer: 'Kesinlikle. Aileniz ve evcil hayvanlarınız için güvenli olan çevre dostu, toksik olmayan temizlik çözümleri kullanıyoruz.'
              },
              {
                question: 'Hizmetten memnun kalmazsam ne olur?',
                answer: '%100 memnuniyet garantisi sunuyoruz. Tamamen memnun kalmazsanız, ek ücret ödemeden sorunu çözmek için geri döneriz.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;