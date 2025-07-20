import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Calendar, Image } from 'lucide-react';
import SimpleGallery from '../components/gallery/SimpleGallery';

const Gallery: React.FC = () => {
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Çalışma Galerisi</h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Profesyonel temizlik hizmetlerimizin sonuçlarını keşfedin. 
              Her proje, kalite ve mükemmellik taahhüdümüzü yansıtır.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Component */}
      <div className="bg-white">
        <SimpleGallery />
      </div>

      {/* Stats Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50+', label: 'Galeri Görseli' },
              { number: '4.9', label: 'Ortalama Puan' },
              { number: '%99', label: 'Müşteri Memnuniyeti' },
              { number: '4', label: 'Hizmet Kategorisi' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Siz de Bu Kaliteyi Deneyimleyin
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Profesyonel temizlik hizmetlerimiz ile evinizi ve işyerinizi yenileyin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rezervasyon" className="inline-block">
                <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  <Calendar className="w-5 h-5 mr-2 inline" />
                  Rezervasyon Yap
                </button>
              </Link>
              <a href="tel:+903123509595" className="inline-block">
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                  <Phone className="w-5 h-5 mr-2 inline" />
                  Ara (0312) 350 95 95
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hizmetlerimiz Hakkında Detaylı Bilgi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Her hizmetimiz hakkında detaylı bilgi almak ve süreçlerimizi öğrenmek için hizmet sayfalarımızı ziyaret edin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Halı Yıkama',
                description: '8 fırçalı otomatik makinelerle profesyonel temizlik',
                link: '/hizmetler/hali-yikama',
                color: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Koltuk Yıkama',
                description: 'Kumaş koruyucu özel temizlik yöntemleri',
                link: '/hizmetler/koltuk-yikama',
                color: 'from-green-500 to-green-600'
              },
              {
                title: 'Perde Temizliği',
                description: 'Çıkarma, yıkama ve takma hizmeti dahil',
                link: '/hizmetler/perde-temizligi',
                color: 'from-purple-500 to-purple-600'
              },
              {
                title: 'Özel Hizmetler',
                description: 'Leke çıkarma ve hassas kumaş bakımı',
                link: '/hizmetler/ozel-hizmetler',
                color: 'from-orange-500 to-orange-600'
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link to={service.link}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary-200 transform hover:-translate-y-1">
                    <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-6 h-6 bg-white rounded opacity-80" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700">
                      Detayları Gör <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sürekli Güncellenen Galeri</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Galerimi sürekli olarak yeni projelerimizle güncelliyoruz. Her hizmet kategorisinde 
                gerçekleştirdiğimiz işlerin öncesi ve sonrası fotoğraflarını, kullandığımız ekipmanları 
                ve çalışma süreçlerimizi burada bulabilirsiniz.
              </p>
              <p className="text-sm text-gray-500">
                Tüm görseller gerçek müşteri projelerinden alınmıştır ve izin alınarak paylaşılmaktadır.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;