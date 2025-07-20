import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main CTA Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Gerçek Temizlikle Tanışmaya
              <br />
              <span className="text-yellow-300">Hazır mısınız?</span>
            </h2>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Profesyonel temizlik ihtiyaçları için Olgu Temizlik'e güvenen binlerce 
              memnun müşteriye katılın. Bugün rezervasyon yapın ve farkı görün.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/rezervasyon" className="inline-block">
              <button className="bg-white text-primary-700 hover:bg-gray-50 hover:text-primary-800 px-8 py-3 rounded-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px] w-full sm:w-auto flex items-center justify-center">
                <Calendar className="w-5 h-5 mr-2" />
                Online Rezervasyon
              </button>
            </Link>
            <a href="tel:+903123509595" className="inline-block">
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-3 rounded-lg font-semibold min-w-[200px] w-full sm:w-auto transition-all duration-300 flex items-center justify-center">
                <Phone className="w-5 h-5 mr-2" />
                Ara (0312) 350 95 95
              </button>
            </a>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {/* Online Booking */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Online Rezervasyon</h3>
              <p className="text-primary-100 mb-4">
                Kolay online rezervasyon sistemi ile 7/24 hizmet planlayın
              </p>
              <Link to="/rezervasyon" className="inline-flex items-center text-yellow-300 hover:text-yellow-200 font-medium">
                Rezervasyon Yap <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Phone Support */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Direkt Arayın</h3>
              <p className="text-primary-100 mb-4">
                Anında yardım ve özel fiyat teklifleri için uzmanlarımızla konuşun
              </p>
              <a href="tel:+903123509595" className="inline-flex items-center text-yellow-300 hover:text-yellow-200 font-medium">
                (0312) 350 95 95 <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">WhatsApp</h3>
              <p className="text-primary-100 mb-4">
                Hızlı sorular? Anında destek için WhatsApp'tan mesaj atın
              </p>
              <a href="https://wa.me/905332002662" className="inline-flex items-center text-yellow-300 hover:text-yellow-200 font-medium">
                Mesaj Gönder <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </motion.div>

          {/* Guarantee Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-white font-medium">%100 Memnuniyet Garantisi - Memnun değil misiniz? Düzeltiriz!</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;